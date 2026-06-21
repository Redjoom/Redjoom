import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, random } from "remotion";
import { FONT_FAMILY, INK_COLOR, PAPER_COLOR } from "./constants";
import { getJitterTransform } from "./doodleStyle";

const blobPath = (seed: string, width: number, height: number): string => {
  const points = 10;
  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2;
  const ry = height / 2;

  const coords: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const wobble = 0.85 + random(`${seed}-blob-${i}`) * 0.25;
    coords.push([
      cx + Math.cos(angle) * rx * wobble,
      cy + Math.sin(angle) * ry * wobble,
    ]);
  }

  const [first, ...rest] = coords;
  const path = rest.reduce(
    (acc, [x, y]) => `${acc} L ${x.toFixed(1)} ${y.toFixed(1)}`,
    `M ${first[0].toFixed(1)} ${first[1].toFixed(1)}`,
  );
  return `${path} Z`;
};

export const Caption: React.FC<{ text: string; seed: string }> = ({
  text,
  seed,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 140 },
    durationInFrames: 14,
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const scale = interpolate(entrance, [0, 1], [0.85, 1]);
  const wiggle = interpolate(frame, [0, 10], [1, 0], {
    extrapolateRight: "clamp",
  });
  const rotation = wiggle * (random(`${seed}-caption-rot`) - 0.5) * 10;

  const blobWidth = 940;
  const blobHeight = 320;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "8%",
        left: "50%",
        width: blobWidth,
        transform: `translateX(-50%) scale(${scale}) rotate(${rotation.toFixed(2)}deg)`,
        opacity: fadeOut,
      }}
    >
      <svg
        width={blobWidth}
        height={blobHeight}
        viewBox={`0 0 ${blobWidth} ${blobHeight}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path
          d={blobPath(seed, blobWidth, blobHeight)}
          fill={PAPER_COLOR}
          stroke={INK_COLOR}
          strokeWidth={5}
        />
      </svg>
      <div
        style={{
          position: "relative",
          width: blobWidth,
          height: blobHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          textAlign: "center",
          transform: getJitterTransform(`${seed}-caption`, frame),
        }}
      >
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 46,
            lineHeight: 1.2,
            color: INK_COLOR,
            margin: 0,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
