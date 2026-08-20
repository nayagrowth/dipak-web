/**
 * Pure mathematical helpers for Three.js page-turn vertex deformation and timing.
 * Fully deterministic, zero-drift, and reversible.
 */

export const THETA_MAX = (155.0 * Math.PI) / 180.0;

export function range(p: number, start: number, end: number): number {
  if (end <= start) return p >= start ? 1 : 0;
  return Math.max(0, Math.min(1, (p - start) / (end - start)));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function calculateFoldX(p: number, pageWidth: number): number {
  const startX = pageWidth * 0.58;
  const endX = -pageWidth * 0.72;
  const t = Math.pow(p, 1.12);
  return startX + (endX - startX) * t;
}

export function calculateFoldRadius(p: number, pageWidth: number): number {
  const minR = pageWidth * 0.14;
  const maxR = pageWidth * 0.36;

  if (p < 0.35) {
    const t = p / 0.35;
    return maxR - (maxR - minR) * smoothstep(0, 1, t);
  } else if (p < 0.70) {
    const t = (p - 0.35) / 0.35;
    return minR + pageWidth * 0.06 * smoothstep(0, 1, t);
  } else {
    const t = (p - 0.70) / 0.30;
    return minR + pageWidth * 0.06 + maxR * 0.5 * smoothstep(0, 1, t);
  }
}

export function calculateFoldAngle(p: number): number {
  const baseAngleDeg = 8.5;
  const angleDeg = baseAngleDeg * (1.0 - range(p, 0.60, 1.0) * 0.35);
  return (angleDeg * Math.PI) / 180.0;
}

export function calculateTwist(p: number): number {
  const enter = range(p, 0.05, 0.30);
  const exit = range(p, 0.60, 0.85);
  return (enter - exit) * 0.025;
}

export function calculateGroupRotationY(p: number): number {
  if (p < 0.18) return 0;
  if (p < 0.55) {
    const t = range(p, 0.18, 0.55);
    return (-60.0 * Math.PI / 180.0) * smoothstep(0, 1, t);
  }
  const t = range(p, 0.55, 0.78);
  const startRad = (-60.0 * Math.PI) / 180.0;
  const endRad = (-105.0 * Math.PI) / 180.0;
  return startRad + (endRad - startRad) * smoothstep(0, 1, t);
}

export function calculateGroupPositionX(p: number, pageWidth: number): number {
  if (p < 0.35) return 0;
  const t = range(p, 0.35, 0.78);
  return -0.45 * pageWidth * smoothstep(0, 1, t);
}

export function calculateGroupPositionZ(p: number, pageWidth: number): number {
  if (p < 0.15) return 0;
  const lift = range(p, 0.15, 0.45);
  const settle = range(p, 0.55, 0.78);
  return (lift - settle * 0.8) * (0.06 * pageWidth);
}

export function calculateGroupRotationZ(p: number): number {
  if (p < 0.20) return 0;
  const t = range(p, 0.20, 0.75);
  return (-3.0 * Math.PI / 180.0) * smoothstep(0, 1, t);
}

export function deformVertex(
  x: number,
  y: number,
  z: number,
  foldX: number,
  radius: number,
  angleRad: number,
  twist: number
): { x: number; y: number; z: number; nx: number; ny: number; nz: number } {
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);

  const yTwist = y * twist;
  const dist = (x - foldX) * cosA - (y + yTwist) * sinA;

  if (dist <= 0) {
    return { x, y, z, nx: 0, ny: 0, nz: 1 };
  }

  const theta = dist / radius;

  if (theta <= THETA_MAX) {
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    const delta = radius * sinT - dist;

    const newX = x + delta * cosA;
    const newY = y - delta * sinA;
    const newZ = z + radius * (1.0 - cosT);

    const nx = -sinT * cosA;
    const ny = sinT * sinA;
    const nz = cosT;

    return { x: newX, y: newY, z: newZ, nx, ny, nz };
  } else {
    const sinMax = Math.sin(THETA_MAX);
    const cosMax = Math.cos(THETA_MAX);
    const extra = dist - radius * THETA_MAX;

    const uPrime = radius * sinMax + extra * cosMax;
    const zPrime = radius * (1.0 - cosMax) + extra * sinMax;
    const delta = uPrime - dist;

    const newX = x + delta * cosA;
    const newY = y - delta * sinA;
    const newZ = z + zPrime;

    const nx = -sinMax * cosA;
    const ny = sinMax * sinA;
    const nz = cosMax;

    return { x: newX, y: newY, z: newZ, nx, ny, nz };
  }
}
