import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SceneConfig } from "./types";
import { DoodleBackground } from "./DoodleBackground";
import { Caption } from "./Caption";
import { SceneOnePlaceholder } from "./SceneOnePlaceholder";
import { RoughEdgeFilter } from "./RoughEdgeFilter";
import { getJitterTransform, getStaticTilt } from "./doodleStyle";

const getEnterScale = (
  enter: SceneConfig["enter"],
  entrance: number,
): number => {
  if (enter === "pop") {
    return interpolate(entrance, [0, 1], [0.6, 1]);
  }
  if (enter === "slideStagger") {
    return interpolate(entrance, [0, 1], [0.8, 1]);
  }
  return 1;
};

const getEnterOffsetX = (
  enter: SceneConfig["enter"],
  entrance: number,
): number => {
  if (enter === "slideStagger") {
    return interpolate(entrance, [0, 1], [-260, 0]);
  }
  return 0;
};

const getEnterShake = (
  enter: SceneConfig["enter"],
  frame: number,
): number => {
  if (enter !== "shake") {
    return 0;
  }
  const decay = interpolate(frame, [0, 16], [1, 0], {
    extrapolateRight: "clamp",
  });
  return Math.sin(frame * 2.4) * 8 * decay;
};

export const Scene: React.FC<{ scene: SceneConfig }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 130 },
    durationInFrames: 16,
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const tilt = getStaticTilt(scene.id);
  const scale = getEnterScale(scene.enter, entrance) * exit + (1 - exit) * 0.96;
  const offsetX = getEnterOffsetX(scene.enter, entrance);
  const shake = getEnterShake(scene.enter, frame);
  const jitter = getJitterTransform(scene.id, frame);

  const filterId = `rough-edge-${scene.id}`;

  return (
    <AbsoluteFill>
      <DoodleBackground
        imageSrc={scene.imageSrc}
        accentColor={scene.accentColor}
        seed={scene.id}
      />

      <RoughEdgeFilter id={filterId} seed={scene.id} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "10%",
        }}
      >
        <div
          style={{
            width: "88%",
            transform: `translate(${offsetX}px, 0) ${jitter} rotate(${(tilt + shake).toFixed(2)}deg) scale(${scale})`,
            filter: `url(#${filterId})`,
          }}
        >
          {scene.imageSrc ? (
            <Img
              src={staticFile(scene.imageSrc)}
              style={{
                width: "100%",
                display: "block",
                border: "6px solid #1a1a1a",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "1376 / 768",
                backgroundColor: "#f4efe3",
                border: "6px solid #1a1a1a",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              }}
            >
              <SceneOnePlaceholder seed={scene.id} />
            </div>
          )}
        </div>
      </AbsoluteFill>

      <Caption text={scene.caption} seed={scene.id} />
    </AbsoluteFill>
  );
};
