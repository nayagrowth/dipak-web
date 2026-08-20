import type * as THREE from "three";

export interface PageTurnSceneRefs {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  mesh: THREE.Mesh;
  frontMaterial: THREE.ShaderMaterial;
  shadowMesh: THREE.Mesh;
  directionalLight: THREE.DirectionalLight;
  ambientLight: THREE.AmbientLight;
  pageWidth: number;
  pageHeight: number;
}

export interface PageTurnUniforms {
  [uniform: string]: THREE.IUniform;
  uProgress: { value: number };
  uFoldX: { value: number };
  uFoldRadius: { value: number };
  uFoldAngle: { value: number };
  uTwist: { value: number };
  uPageWidth: { value: number };
  uPageHeight: { value: number };
  uHeroTexture: { value: THREE.Texture | null };
  uLightDir: { value: THREE.Vector3 };
  uGoldHandoff: { value: number };
}

export interface PageTurnDebugInfo {
  progress: number;
  foldAxisX: number;
  foldRadius: number;
  twistAmount: number;
  cameraFov: number;
  drawCalls: number;
  triangles: number;
  textureRes: string;
  frameMs: number;
  fps: number;
}
