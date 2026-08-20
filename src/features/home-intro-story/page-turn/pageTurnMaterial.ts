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

  void main() {
    vUv = uv;

    vec3 pos = position;
    vec3 norm = normal;

    // Normal direction to fold axis in XY plane
    float cosA = cos(uFoldAngle);
    float sinA = sin(uFoldAngle);

    // Apply organic vertical twist
    float yTwist = pos.y * uTwist;
    float dist = (pos.x - uFoldX) * cosA - (pos.y + yTwist) * sinA;

    float curvature = 0.0;

    if (dist > 0.0) {
      float theta = dist / uFoldRadius;

      if (theta < PI) {
        // Active cylindrical deformation around the moving fold
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
        // Fully turned page section (flat reverse side)
        float flatDist = dist - PI * uFoldRadius;
        float delta = -(flatDist + dist);

        pos.x += delta * cosA;
        pos.y -= delta * sinA;
        pos.z += 2.0 * uFoldRadius;

        norm.x = 0.0;
        norm.y = 0.0;
        norm.z = -1.0;

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

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  varying float vCurvature;

  const vec3 GOLD_COLOR = vec3(0.784, 0.584, 0.271); // #c89545
  const vec3 WARM_IVORY = vec3(0.945, 0.925, 0.882); // #f1ece1
  const vec3 BACK_SEAL_COLOR = vec3(0.627, 0.471, 0.208); // #a07835

  // Procedural DV Monogram Seal for the reverse matte paper side
  float drawSeal(vec2 uv) {
    vec2 c = uv - vec2(0.5, 0.5);
    float r = length(c);
    
    // Outer dashed ring
    float ring1 = smoothstep(0.003, 0.0, abs(r - 0.18));
    // Inner solid ring
    float ring2 = smoothstep(0.002, 0.0, abs(r - 0.15));
    
    // Center DV monogram approximation
    float dBox = max(abs(c.x + 0.04), abs(c.y)) - 0.045;
    float dStroke = abs(dBox) - 0.006;
    float dLetter = smoothstep(0.003, 0.0, dStroke);
    
    float vBox = abs(c.x - 0.04 + c.y * 0.3) - 0.006;
    float vLetter = smoothstep(0.003, 0.0, vBox) * step(abs(c.y), 0.045);

    return clamp(ring1 * 0.7 + ring2 * 0.9 + (dLetter + vLetter) * 0.85, 0.0, 1.0);
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    vec3 L = normalize(uLightDir);

    bool isFront = gl_FrontFacing;

    if (!isFront) {
      N = -N;
    }

    // Directional Diffuse (Lambert)
    float NdotL = max(0.0, dot(N, L));
    float ambient = 0.42;
    float diffuse = NdotL * 0.58;
    float lighting = ambient + diffuse;

    // Moving Specular Highlight tracking the fold curvature crest
    vec3 H = normalize(L + V);
    float NdotH = max(0.0, dot(N, H));
    float specular = pow(NdotH, 24.0) * vCurvature * 0.45;

    // Fresnel Rim Highlight along the glancing edges
    float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.8) * (0.2 + 0.8 * vCurvature);
    vec3 rimColor = mix(vec3(1.0, 0.98, 0.94), GOLD_COLOR, uGoldHandoff);

    if (isFront) {
      // Front side: Captured Hero Texture
      vec4 texColor = texture2D(uHeroTexture, vUv);
      vec3 finalColor = texColor.rgb * lighting;

      // Add fold specular highlight and warm gold rim
      finalColor += vec3(1.0, 0.97, 0.92) * specular;
      finalColor += rimColor * fresnel * 0.35;

      gl_FragColor = vec4(finalColor, texColor.a);
    } else {
      // Reverse side: Warm matte paper with editorial DV seal
      vec3 basePaper = WARM_IVORY;
      
      // Subtle paper grain & gradient wash
      float paperGrad = 1.0 - 0.06 * length(vUv - vec2(0.5, 0.5));
      basePaper *= paperGrad;

      // Draw Monogram Seal
      float sealMask = drawSeal(vUv);
      vec3 paperWithSeal = mix(basePaper, BACK_SEAL_COLOR, sealMask * 0.32);

      // Apply physical lighting
      vec3 finalColor = paperWithSeal * lighting;
      finalColor += vec3(1.0, 0.96, 0.90) * specular * 0.6;
      finalColor += rimColor * fresnel * 0.4;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  }
`;

/**
 * Factory for creating the custom PageTurn ShaderMaterial.
 */
export function createPageTurnMaterial(
  heroTexture: THREE.Texture | null,
  pageWidth: number,
  pageHeight: number
): THREE.ShaderMaterial {
  const uniforms: PageTurnUniforms = {
    uProgress: { value: 0.0 },
    uFoldX: { value: pageWidth * 0.62 },
    uFoldRadius: { value: pageWidth * 0.38 },
    uFoldAngle: { value: (9.0 * Math.PI) / 180.0 },
    uTwist: { value: 0.0 },
    uPageWidth: { value: pageWidth },
    uPageHeight: { value: pageHeight },
    uHeroTexture: { value: heroTexture },
    uLightDir: { value: new THREE.Vector3(-0.6, 0.7, 0.9).normalize() },
    uGoldHandoff: { value: 0.0 },
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
