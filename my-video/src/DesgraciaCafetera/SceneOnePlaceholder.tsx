import React from "react";
import { random, useCurrentFrame } from "remotion";
import { PAPER_COLOR } from "./constants";

const jitterPoint = (
  seed: string,
  x: number,
  y: number,
  amount = 4,
): [number, number] => [
  x + (random(`${seed}-x`) - 0.5) * amount,
  y + (random(`${seed}-y`) - 0.5) * amount,
];

const zigzag = (seed: string, x: number, y: number, w: number, h: number): string => {
  const steps = 6;
  let path = `M ${x} ${y}`;
  for (let i = 1; i <= steps; i++) {
    const px = x + (w / steps) * i;
    const py = y + (i % 2 === 0 ? h : -h) + (random(`${seed}-${i}`) - 0.5) * 6;
    path += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
  }
  return path;
};

const ThoughtCloud: React.FC<{ x: number; y: number; scale: number; seed: string }> = ({
  x,
  y,
  scale,
  seed,
}) => {
  const w = 130 * scale;
  const h = 80 * scale;
  const [p0x, p0y] = jitterPoint(seed, x, y);
  return (
    <g>
      <ellipse
        cx={p0x}
        cy={p0y}
        rx={w / 2}
        ry={h / 2}
        fill="#0c0c0c"
        stroke="#000"
        strokeWidth={3}
      />
      <path
        d={zigzag(seed, x - w / 2 + 10, y, w - 20, h / 3)}
        stroke={PAPER_COLOR}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
};

export const SceneOnePlaceholder: React.FC<{ seed: string }> = ({ seed }) => {
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame * 0.12) * 3;

  return (
    <svg
      viewBox="0 0 900 700"
      width="100%"
      height="100%"
      style={{ overflow: "visible" }}
    >
      {/* cama */}
      <rect x={120} y={520} width={620} height={40} fill="#5a3d23" stroke="#1a1a1a" strokeWidth={5} />
      <rect x={140} y={470} width={580} height={60} fill={PAPER_COLOR} stroke="#1a1a1a" strokeWidth={5} />
      <rect x={140} y={420} width={140} height={70} rx={18} fill="#fff" stroke="#1a1a1a" strokeWidth={5} />

      {/* monito de palitos recostado */}
      <g transform={`translate(0, ${breathe})`}>
        <circle cx={350} cy={420} r={48} fill={PAPER_COLOR} stroke="#1a1a1a" strokeWidth={6} />
        <circle cx={332} cy={412} r={9} fill="#1a1a1a" />
        <circle cx={368} cy={412} r={9} fill="#1a1a1a" />
        <path d="M 320 440 Q 350 460 380 440" stroke="#1a1a1a" strokeWidth={5} fill="none" strokeLinecap="round" />
        <line x1={395} y1={420} x2={620} y2={430} stroke="#1a1a1a" strokeWidth={10} strokeLinecap="round" />
        <line x1={500} y1={425} x2={520} y2={350} stroke="#1a1a1a" strokeWidth={8} strokeLinecap="round" />
        <line x1={500} y1={425} x2={470} y2={345} stroke="#1a1a1a" strokeWidth={8} strokeLinecap="round" />
        <line x1={620} y1={430} x2={680} y2={460} stroke="#1a1a1a" strokeWidth={8} strokeLinecap="round" />
        <line x1={620} y1={430} x2={690} y2={400} stroke="#1a1a1a" strokeWidth={8} strokeLinecap="round" />
      </g>

      {/* nubes de pensamiento sobrepensando */}
      <ThoughtCloud x={300} y={220} scale={1.3} seed={`${seed}-cloud-1`} />
      <ThoughtCloud x={460} y={150} scale={1} seed={`${seed}-cloud-2`} />
      <ThoughtCloud x={580} y={240} scale={0.8} seed={`${seed}-cloud-3`} />
      <circle cx={365} cy={300} r={10} fill="#0c0c0c" />
      <circle cx={385} cy={330} r={6} fill="#0c0c0c" />
    </svg>
  );
};
