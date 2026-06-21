import React from "react";
import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { VIDEO_HEIGHT, VIDEO_WIDTH } from "./constants";

const scribblePath = (seed: string, index: number): string => {
  const y = 80 + index * 140 + random(`${seed}-scribble-${index}-y`) * 60;
  const amplitude = 30 + random(`${seed}-scribble-${index}-amp`) * 40;
  const points: string[] = [`M -40 ${y}`];
  for (let x = 0; x <= VIDEO_WIDTH + 40; x += 90) {
    const wobble = (random(`${seed}-scribble-${index}-${x}`) - 0.5) * amplitude;
    points.push(`L ${x} ${y + wobble}`);
  }
  return points.join(" ");
};

export const DoodleBackground: React.FC<{
  imageSrc: string | null;
  accentColor: string;
  seed: string;
}> = ({ imageSrc, accentColor, seed }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: accentColor, overflow: "hidden" }}>
      {imageSrc ? (
        <Img
          src={staticFile(imageSrc)}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "140%",
            height: "140%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
            filter: "blur(50px) saturate(1.4)",
            opacity: 0.55,
          }}
        />
      ) : null}

      <AbsoluteFill
        style={{ backgroundColor: accentColor, opacity: imageSrc ? 0.45 : 1 }}
      />

      <svg
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.18 }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <path
            key={i}
            d={scribblePath(seed, i)}
            fill="none"
            stroke="#ffffff"
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
