import * as THREE from "three";
import {
  calculateFoldAngle,
  calculateFoldRadius,
  calculateFoldX,
  calculateTwist,
  calculateGroupPositionX,
  calculateGroupPositionZ,
  calculateGroupRotationY,
  calculateGroupRotationZ,
  deformVertex,
  range,
} from "./pageTurnMath";
import type { PageTurnDebugInfo, PageTurnSceneRefs } from "./page-turn.types";

export class PageTurnController {
  private refs: PageTurnSceneRefs;
  private currentProgress = 0;
  private lastRenderTime = performance.now();
  private frameDurationMs = 0;

  constructor(refs: PageTurnSceneRefs) {
    this.refs = refs;
  }

  /**
   * Updates shader uniforms, group motion, and renders the scene on-demand.
   * Deterministic, zero-drift, and fully reversible.
   */
  public setProgress(p: number): void {
    const clampedP = Math.max(0, Math.min(1, p));
    this.currentProgress = clampedP;

    const { pageGroup, mesh, frontMaterial, shadowMesh, pageWidth } = this.refs;
    const uniforms = frontMaterial.uniforms;

    // 1. Local vertex deformation parameters
    const foldX = calculateFoldX(clampedP, pageWidth);
    const foldRadius = calculateFoldRadius(clampedP, pageWidth);
    const foldAngle = calculateFoldAngle(clampedP);
    const twist = calculateTwist(clampedP);
    const goldHandoff = range(clampedP, 0.45, 0.75);

    uniforms.uProgress.value = clampedP;
    uniforms.uFoldX.value = foldX;
    uniforms.uFoldRadius.value = foldRadius;
    uniforms.uFoldAngle.value = foldAngle;
    uniforms.uTwist.value = twist;
    uniforms.uGoldHandoff.value = goldHandoff;

    // 2. Global group rotation and translation (exit trajectory)
    pageGroup.rotation.y = calculateGroupRotationY(clampedP);
    pageGroup.position.x = calculateGroupPositionX(clampedP, pageWidth);
    pageGroup.position.z = calculateGroupPositionZ(clampedP, pageWidth);
    pageGroup.rotation.z = calculateGroupRotationZ(clampedP);

    // 3. Synchronize shadow opacity with page height & uncovering
    const shadowMat = shadowMesh.material as THREE.ShadowMaterial;
    const enterShadow = range(clampedP, 0.02, 0.20);
    const exitShadow = range(clampedP, 0.55, 0.75);
    shadowMat.opacity = Math.max(0, enterShadow * 0.22 - exitShadow * 0.22);

    // 4. Hide mesh completely once transition has cleared the viewport (p >= 0.78)
    mesh.visible = clampedP < 0.78;

    this.render();
  }

  /**
   * Toggles shader diagnostics mode.
   * 0 = Final, 1 = Front Texture, 2 = Back Texture, 3 = Normals, 4 = Curvature
   */
  public setDebugMode(mode: number): void {
    const uniforms = this.refs.frontMaterial.uniforms;
    if (uniforms.uDebugMode) {
      uniforms.uDebugMode.value = mode;
      this.render();
    }
  }

  /**
   * Renders a single frame on-demand (no continuous RAF loop when idle).
   */
  public render(): void {
    const start = performance.now();
    const { renderer, scene, camera } = this.refs;
    renderer.render(scene, camera);
    this.frameDurationMs = performance.now() - start;
    this.lastRenderTime = performance.now();
  }

  /**
   * Computes projected screen-space coordinates of the 3D fold axis
   * for the seamless physical-fold -> DOM gold rule handoff.
   */
  public getFoldScreenCoordinates(
    viewportWidth: number,
    viewportHeight: number
  ): { x: number; y: number; angleRad: number; length: number } | null {
    const { camera, pageWidth, pageHeight } = this.refs;
    const p = this.currentProgress;

    if (p < 0.02 || p > 0.78) return null;

    const foldX = calculateFoldX(p, pageWidth);
    const foldRadius = calculateFoldRadius(p, pageWidth);
    const foldAngle = calculateFoldAngle(p);
    const twist = calculateTwist(p);

    // Sample top and bottom points on the fold line
    const yTop = pageHeight * 0.45;
    const yBottom = -pageHeight * 0.45;

    const pTop3D = deformVertex(foldX, yTop, 0, foldX, foldRadius, foldAngle, twist);
    const pBottom3D = deformVertex(foldX, yBottom, 0, foldX, foldRadius, foldAngle, twist);

    const vTop = new THREE.Vector3(pTop3D.x, pTop3D.y, pTop3D.z).project(camera);
    const vBottom = new THREE.Vector3(pBottom3D.x, pBottom3D.y, pBottom3D.z).project(camera);

    const screenX1 = ((vTop.x + 1) / 2) * viewportWidth;
    const screenY1 = ((-vTop.y + 1) / 2) * viewportHeight;

    const screenX2 = ((vBottom.x + 1) / 2) * viewportWidth;
    const screenY2 = ((-vBottom.y + 1) / 2) * viewportHeight;

    const midX = (screenX1 + screenX2) / 2;
    const midY = (screenY1 + screenY2) / 2;
    const dx = screenX2 - screenX1;
    const dy = screenY2 - screenY1;
    const angleRad = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);

    return {
      x: midX,
      y: midY,
      angleRad,
      length,
    };
  }

  /**
   * Resizes viewport, camera, and page geometry.
   */
  public resize(viewportWidth: number, viewportHeight: number): void {
    const { renderer, camera, mesh, shadowMesh, frontMaterial } = this.refs;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    renderer.setPixelRatio(dpr);
    renderer.setSize(viewportWidth, viewportHeight, false);

    camera.aspect = viewportWidth / viewportHeight;
    camera.updateProjectionMatrix();

    const fovRad = (camera.fov * Math.PI) / 180.0;
    const cameraZ = camera.position.z;
    const visibleHeight = 2.0 * cameraZ * Math.tan(fovRad / 2.0);
    const visibleWidth = visibleHeight * camera.aspect;

    this.refs.pageWidth = visibleWidth;
    this.refs.pageHeight = visibleHeight;

    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(visibleWidth, visibleHeight, 64, 36);

    shadowMesh.geometry.dispose();
    shadowMesh.geometry = new THREE.PlaneGeometry(visibleWidth * 1.5, visibleHeight * 1.5);

    frontMaterial.uniforms.uPageWidth.value = visibleWidth;
    frontMaterial.uniforms.uPageHeight.value = visibleHeight;

    this.setProgress(this.currentProgress);
  }

  /**
   * Returns current diagnostics for developer overlay (?debugPageTurn=1).
   */
  public getDebugInfo(): PageTurnDebugInfo {
    const { renderer, camera, frontMaterial } = this.refs;
    const u = frontMaterial.uniforms;

    return {
      progress: this.currentProgress,
      foldAxisX: u.uFoldX.value,
      foldRadius: u.uFoldRadius.value,
      twistAmount: u.uTwist.value,
      cameraFov: camera.fov,
      drawCalls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      textureRes: u.uHeroTexture.value
        ? `${u.uHeroTexture.value.image?.width || 0}x${u.uHeroTexture.value.image?.height || 0}`
        : "None",
      frameMs: Number(this.frameDurationMs.toFixed(2)),
      fps: this.frameDurationMs > 0 ? Math.round(1000 / Math.max(this.frameDurationMs, 1)) : 60,
      debugMode: u.uDebugMode?.value ?? 0,
    };
  }

  /**
   * Cleans up GPU memory and listeners.
   */
  public dispose(): void {
    const { renderer, mesh, shadowMesh, frontMaterial } = this.refs;

    mesh.geometry.dispose();
    shadowMesh.geometry.dispose();

    if (frontMaterial.uniforms.uHeroTexture.value) {
      frontMaterial.uniforms.uHeroTexture.value.dispose();
    }
    frontMaterial.dispose();
    (shadowMesh.material as THREE.Material).dispose();

    renderer.dispose();
  }
}
