import * as THREE from "three";
import type { PageTurnUniforms } from "./page-turn.types";

const PAGE_VERTEX_SHADER = /* glsl */ `
  uniform float uProgress;
  uniform float uFoldX;
  uniform float uFoldRadius;
  uniform float uFoldAngle;
  uniform float uTwist;
  uniform float uPageWidth;
  uniform float uPageHeight;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  varying float vCurvature;

  const float PI = 3.14159265358979323846;
  const float THETA_MAX = 2.70526034059; // 155 degrees in radians

  void main() {
    vUv = uv;

    vec3 pos = position;
    vec3 norm = normal;

    // Normal direction to fold axis in XY plane
    float cosA = cos(uFoldAngle);
    float sinA = sin(uFoldAngle);

    // Apply restrained organic vertical twist
    float yTwist = pos.y * uTwist;
    float dist = (pos.x - uFoldX) * cosA - (pos.y + yTwist) * sinA;

    float curvature = 0.0;

    if (dist > 0.0) {
      float theta = dist / uFoldRadius;

      if (theta <= THETA_MAX) {
        // Active cylindrical deformation around moving fold
        float sinT = sin(theta);
        float cosT = cos(theta);
        float delta = uFoldRadius * sinT - dist;

        pos.x += delta * cosA;
        pos.y -= delta * sinA;
        pos.z += uFoldRadius * (1.0 - cosT);

        // Deformed surface normal
        norm.x = -sinT * cosA;
        norm.y = sinT * sinA;
        norm.z = cosT;

        // Curvature factor: peaks at crest of fold (theta = PI/2)
        curvature = sinT;
      } else {
        // Tangent-continuation line: preserves flat sheet trajectory without folding back
        float sinMax = sin(THETA_MAX);
        float cosMax = cos(THETA_MAX);
        float extra = dist - uFoldRadius * THETA_MAX;

        float uPrime = uFoldRadius * sinMax + extra * cosMax;
        float zPrime = uFoldRadius * (1.0 - cosMax) + extra * sinMax;
        float delta = uPrime - dist;

        pos.x += delta * cosA;
        pos.y -= delta * sinA;
        pos.z += zPrime;

        norm.x = -sinMax * cosA;
        norm.y = sinMax * sinA;
        norm.z = cosMax;

        curvature = 0.0;
      }
    }

    vCurvature = curvature;
    vNormal = normalize(normalMatrix * norm);

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PAGE_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uHeroTexture;
  uniform vec3 uLightDir;
  uniform float uGoldHandoff;
  uniform float uProgress;
  uniform float uDebugMode;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  varying float vCurvature;

  const vec3 GOLD_COLOR = vec3(0.784, 0.584, 0.271); // #c89545
  const vec3 WARM_IVORY = vec3(0.965, 0.949, 0.918); // #f6f2ea luxury paper
  const vec3 BACK_SEAL_COLOR = vec3(0.686, 0.541, 0.282); // #af8a48

  // Procedural DV Monogram Seal for reverse paper side
  float drawSeal(vec2 uv) {
    vec2 c = uv - vec2(0.5, 0.5);
    float r = length(c);
    
    // Outer dashed ring
    float ring1 = smoothstep(0.003, 0.0, abs(r - 0.16));
    // Inner solid ring
    float ring2 = smoothstep(0.002, 0.0, abs(r - 0.135));
    
    // Center DV monogram approximation
    float dBox = max(abs(c.x + 0.035), abs(c.y)) - 0.04;
    float dStroke = abs(dBox) - 0.005;
    float dLetter = smoothstep(0.003, 0.0, dStroke);
    
    float vBox = abs(c.x - 0.035 + c.y * 0.28) - 0.005;
    float vLetter = smoothstep(0.003, 0.0, vBox) * step(abs(c.y), 0.04);

    return clamp(ring1 * 0.5 + ring2 * 0.7 + (dLetter + vLetter) * 0.65, 0.0, 1.0);
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    vec3 L = normalize(uLightDir);

    // Diagnostics / Debug Modes
    if (uDebugMode > 0.5 && uDebugMode < 1.5) {
      gl_FragColor = texture2D(uHeroTexture, vUv);
      return;
    }
    if (uDebugMode > 1.5 && uDebugMode < 2.5) {
      gl_FragColor = vec4(WARM_IVORY, 1.0);
      return;
    }
    if (uDebugMode > 2.5 && uDebugMode < 3.5) {
      gl_FragColor = vec4(N * 0.5 + 0.5, 1.0);
      return;
    }
    if (uDebugMode > 3.5 && uDebugMode < 4.5) {
      gl_FragColor = vec4(vec3(vCurvature), 1.0);
      return;
    }

    bool isFront = gl_FrontFacing;

    if (!isFront) {
      N = -N;
    }

    // Directional Diffuse (High ambient baseline keeps paper bright & readable)
    float NdotL = max(0.0, dot(N, L));
    float ambient = 0.68;
    float diffuse = NdotL * 0.32;
    float lighting = ambient + diffuse;

    // Moving Specular Highlight tracking fold curvature crest
    vec3 H = normalize(L + V);
    float NdotH = max(0.0, dot(N, H));
    float specular = pow(NdotH, 20.0) * vCurvature * 0.35;

    // Fresnel Rim Highlight along glancing edges
    float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.5) * (0.15 + 0.85 * vCurvature);
    vec3 rimColor = mix(vec3(1.0, 0.98, 0.95), GOLD_COLOR, uGoldHandoff);

    if (isFront) {
      // Front side: Captured Hero Texture
      vec4 texColor = texture2D(uHeroTexture, vUv);
      vec3 finalColor = texColor.rgb * lighting;

      // Add fold specular highlight and warm gold rim
      finalColor += vec3(1.0, 0.97, 0.93) * specular;
      finalColor += rimColor * fresnel * 0.25;

      gl_FragColor = vec4(finalColor, texColor.a);
    } else {
      // Reverse side: Warm luminous ivory paper with restrained DV seal
      vec3 basePaper = WARM_IVORY;
      
      // Subtle paper gradient
      float paperGrad = 1.0 - 0.04 * length(vUv - vec2(0.5, 0.5));
      basePaper *= paperGrad;

      // Draw Monogram Seal (subtle watermark effect)
      float sealMask = drawSeal(vUv);
      vec3 paperWithSeal = mix(basePaper, BACK_SEAL_COLOR, sealMask * 0.18);

      // Apply physical lighting with guaranteed minimum luminance
      vec3 finalColor = paperWithSeal * max(0.55, lighting);
      finalColor += vec3(1.0, 0.97, 0.92) * specular * 0.4;
      finalColor += rimColor * fresnel * 0.3;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  }
`;

export function createPageTurnMaterial(
  heroTexture: THREE.Texture | null,
  pageWidth: number,
  pageHeight: number
): THREE.ShaderMaterial {
  const uniforms: PageTurnUniforms = {
    uProgress: { value: 0.0 },
    uFoldX: { value: pageWidth * 0.58 },
    uFoldRadius: { value: pageWidth * 0.36 },
    uFoldAngle: { value: (8.5 * Math.PI) / 180.0 },
    uTwist: { value: 0.0 },
    uPageWidth: { value: pageWidth },
    uPageHeight: { value: pageHeight },
    uHeroTexture: { value: heroTexture },
    uLightDir: { value: new THREE.Vector3(-0.5, 0.6, 0.9).normalize() },
    uGoldHandoff: { value: 0.0 },
    uDebugMode: { value: 0.0 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: PAGE_VERTEX_SHADER,
    fragmentShader: PAGE_FRAGMENT_SHADER,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: true,
    depthTest: true,
  });
}
