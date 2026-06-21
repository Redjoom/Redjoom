import { random } from "remotion";

// Small fixed rotation per scene, so each panel looks "stuck on crooked".
export const getStaticTilt = (seed: string): number => {
  return (random(seed) - 0.5) * 6;
};

// Sinusoidal jitter so each scene trembles with its own stable pattern.
export const getJitterTransform = (seed: string, frame: number): string => {
  const freqX = 0.15 + random(`${seed}-freq-x`) * 0.1;
  const freqY = 0.12 + random(`${seed}-freq-y`) * 0.1;
  const phaseX = random(`${seed}-phase-x`) * Math.PI * 2;
  const phaseY = random(`${seed}-phase-y`) * Math.PI * 2;
  const amplitude = 2.5;

  const x = Math.sin(frame * freqX + phaseX) * amplitude;
  const y = Math.cos(frame * freqY + phaseY) * amplitude;

  return `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
};

// Irregular hand-drawn-looking rectangle border, drawn as an SVG path.
export const getRoughRectPath = (
  seed: string,
  width: number,
  height: number,
  wobble: number,
): string => {
  const corners: [number, number][] = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];

  const jittered = corners.map(([x, y], i) => {
    const dx = (random(`${seed}-rect-${i}-x`) - 0.5) * wobble;
    const dy = (random(`${seed}-rect-${i}-y`) - 0.5) * wobble;
    return [x + dx, y + dy];
  });

  const [p0, p1, p2, p3] = jittered;
  return `M ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]} Z`;
};
