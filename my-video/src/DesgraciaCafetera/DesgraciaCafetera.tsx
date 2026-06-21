import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { Scene } from "./Scene";
import { SCENES } from "./scenes";
import { INK_COLOR } from "./constants";

export const desgraciaCafeteraSchema = z.object({});

export const DesgraciaCafetera: React.FC<
  z.infer<typeof desgraciaCafeteraSchema>
> = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: INK_COLOR }}>
      {SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          name={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
        >
          <Scene scene={scene} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
