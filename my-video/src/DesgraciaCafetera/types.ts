export type EnterStyle = "pop" | "shake" | "slideStagger";

export type SceneConfig = {
  id: string;
  startFrame: number;
  durationInFrames: number;
  caption: string;
  imageSrc: string | null;
  accentColor: string;
  enter: EnterStyle;
};
