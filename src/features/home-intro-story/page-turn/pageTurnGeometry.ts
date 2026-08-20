import * as THREE from "three";

/**
 * Creates the subdivided PlaneGeometry for smooth GPU vertex deformation.
 * 64 subdivisions on width and 36 on height provides ~4,608 quads / ~9,216 triangles,
 * ensuring butter-smooth curvature without any faceted silhouette on modern GPUs.
 */
export function createPageGeometry(
  width: number,
  height: number,
  segmentsX = 64,
  segmentsY = 36
): THREE.PlaneGeometry {
  return new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
}

/**
 * Creates a shadow-receiving plane sized for Act 2 underneath.
 */
export function createShadowPlaneGeometry(
  width: number,
  height: number
): THREE.PlaneGeometry {
  return new THREE.PlaneGeometry(width * 1.5, height * 1.5);
}
