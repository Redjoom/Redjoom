import React from "react";
import { random } from "remotion";

// Hidden SVG filter that lets a container be referenced via `filter: url(#id)`
// to deform its straight edges into a hand-drawn wobble.
export const RoughEdgeFilter: React.FC<{ id: string; seed: string }> = ({
  id,
  seed,
}) => {
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <defs>
        <filter id={id}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.025"
            numOctaves={2}
            seed={Math.floor(random(`${seed}-turbulence`) * 1000)}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} />
        </filter>
      </defs>
    </svg>
  );
};
