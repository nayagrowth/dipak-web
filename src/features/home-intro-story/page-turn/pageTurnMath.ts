/**
 * Pure mathematical helpers for Three.js page-turn vertex deformation and timing.
 * Fully deterministic and reversible.
 */

/**
 * Clamps and normalizes progress p within [start, end] to [0, 1].
 */
export function range(p: number, start: number, end: number): number {
  if (end <= start) return p >= start ? 1 : 0;
  return Math.max(0, Math.min(1, (p - start) / (end - start)));
}

/**
 * Smoothstep interpolation between edge0 and edge1.
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Computes the X coordinate of the fold axis across the page width.
 * Page width spans from -width/2 (spine) to +width/2 (free edge).
 */
export function calculateFoldX(p: number, pageWidth: number): number {
  // Start slightly beyond the right edge, travel all the way past the left spine
  const startX = pageWidth * 0.62;
  const endX = -pageWidth * 0.85;
  
  // Custom non-linear easing for natural physical page turn cadence:
  // Initial resistance -> smooth acceleration -> graceful exit
  const t = Math.pow(p, 1.15);
  return startX + (endX - startX) * t;
}

/**
 * Computes variable curl radius based on progress.
 * High radius initially (gentle lift) -> tightest in mid-curl -> opens up on completion.
 */
export function calculateFoldRadius(p: number, pageWidth: number): number {
  const minR = pageWidth * 0.12;
  const maxR = pageWidth * 0.38;

  if (p < 0.35) {
    // Tightening from gentle lift to strong curl
    const t = p / 0.35;
    return maxR - (maxR - minR) * smoothstep(0, 1, t);
  } else if (p < 0.75) {
    // Tight curl through the vertical flip
    const t = (p - 0.35) / 0.4;
    return minR + (pageWidth * 0.08) * smoothstep(0, 1, t);
  } else {
    // Opening up as the page settles past the frame
    const t = (p - 0.75) / 0.25;
    return (minR + pageWidth * 0.08) + (maxR * 0.6) * smoothstep(0, 1, t);
  }
}

/**
 * Computes fold axis tilt angle in radians (6 to 12 degrees).
 * Tilts so bottom-right corner leads the turn.
 */
export function calculateFoldAngle(p: number): number {
  // 9 degrees base tilt, slightly relaxes as it leaves
  const baseAngleDeg = 9.0;
  const angleDeg = baseAngleDeg * (1.0 - range(p, 0.65, 1.0) * 0.4);
  return (angleDeg * Math.PI) / 180.0;
}

/**
 * Computes organic twist amount along the vertical Y dimension.
 */
export function calculateTwist(p: number): number {
  // Peak twist during mid-turn (p = 0.2 to 0.6)
  const enter = range(p, 0.05, 0.3);
  const exit = range(p, 0.6, 0.9);
  return (enter - exit) * 0.08;
}

/**
 * CPU version of the cylindrical vertex deformation for unit tests and gold-rule projection.
 */
export function deformVertex(
  x: number,
  y: number,
  z: number,
  foldX: number,
  radius: number,
  angleRad: number,
  twist: number
): { x: number; y: number; z: number; nx: number; ny: number; nz: number } {
  // Normal direction to fold axis
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);

  // Apply subtle organic vertical twist
  const yTwist = y * twist;
  const dist = (x - foldX) * cosA - (y + yTwist) * sinA;

  if (dist <= 0) {
    // Spine side (flat)
    return { x, y, z, nx: 0, ny: 0, nz: 1 };
  }

  const theta = dist / radius;

  if (theta < Math.PI) {
    // Wrapping around the cylinder
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    const delta = radius * sinT - dist;

    const newX = x + delta * cosA;
    const newY = y - delta * sinA;
    const newZ = z + radius * (1.0 - cosT);

    // Recomputed normal on curved cylinder
    const nx = -sinT * cosA;
    const ny = sinT * sinA;
    const nz = cosT;

    return { x: newX, y: newY, z: newZ, nx, ny, nz };
  } else {
    // Turned past 180 degrees (flat reverse side)
    const flatDist = dist - Math.PI * radius;
    const delta = -(flatDist + dist);

    const newX = x + delta * cosA;
    const newY = y - delta * sinA;
    const newZ = z + 2.0 * radius;

    return { x: newX, y: newY, z: newZ, nx: 0, ny: 0, nz: -1 };
  }
}
