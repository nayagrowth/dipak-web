import * as THREE from "three";
import { createPageGeometry } from "./pageTurnGeometry";
import { createPageTurnMaterial } from "./pageTurnMaterial";
import type { PageTurnSceneRefs } from "./page-turn.types";

/**
 * Instantiates the isolated Three.js scene, perspective camera, lights,
 * deformable page mesh, and shadow receiving layer.
 */
export async function createPageTurnScene(
  canvas: HTMLCanvasElement,
  viewportWidth: number,
  viewportHeight: number,
  heroTexture: THREE.Texture | null
): Promise<PageTurnSceneRefs> {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
  });

  renderer.setPixelRatio(dpr);
  renderer.setSize(viewportWidth, viewportHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Perspective camera with restrained editorial FOV (35 degrees)
  const fov = 35.0;
  const aspect = viewportWidth / viewportHeight;
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100.0);

  // Exact math: place camera at distance Z such that plane at Z=0 exactly fills viewport
  const fovRad = (fov * Math.PI) / 180.0;
  const cameraZ = 10.0;
  camera.position.set(0, 0, cameraZ);
  camera.lookAt(0, 0, 0);

  const visibleHeight = 2.0 * cameraZ * Math.tan(fovRad / 2.0);
  const visibleWidth = visibleHeight * aspect;

  const scene = new THREE.Scene();

  // Lighting: Controlled warm key light + ambient fill
  const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.35);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xfff5e4, 1.15);
  directionalLight.position.set(-visibleWidth * 0.4, visibleHeight * 0.6, cameraZ * 0.7);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = cameraZ * 2.0;
  directionalLight.shadow.bias = -0.0005;
  scene.add(directionalLight);

  // Deformable Page Mesh
  const pageGeometry = createPageGeometry(visibleWidth, visibleHeight, 64, 36);
  const frontMaterial = createPageTurnMaterial(heroTexture, visibleWidth, visibleHeight);

  const mesh = new THREE.Mesh(pageGeometry, frontMaterial);
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  scene.add(mesh);

  // Shadow receiving plane (representing Act 2 background surface underneath)
  const shadowGeo = new THREE.PlaneGeometry(visibleWidth * 1.5, visibleHeight * 1.5);
  const shadowMat = new THREE.ShadowMaterial({
    opacity: 0.22,
    transparent: true,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.position.set(0, 0, -0.02);
  shadowMesh.receiveShadow = true;
  scene.add(shadowMesh);

  // Precompile page shaders to avoid first-scroll GPU stalls
  await renderer.compileAsync(scene, camera);

  return {
    renderer,
    scene,
    camera,
    mesh,
    frontMaterial,
    shadowMesh,
    directionalLight,
    ambientLight,
    pageWidth: visibleWidth,
    pageHeight: visibleHeight,
  };
}
