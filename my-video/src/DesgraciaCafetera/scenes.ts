import type { SceneConfig } from "./types";

export const SCENES: SceneConfig[] = [
  {
    id: "scene-01",
    startFrame: 0,
    durationInFrames: 90,
    caption:
      "Son las 6 de la mañana y mi cerebro decide que es el momento perfecto para...",
    imageSrc: null,
    accentColor: "#1f2a44",
    enter: "pop",
  },
  {
    id: "scene-02",
    startFrame: 90,
    durationInFrames: 120,
    caption:
      "...sobrepensar absolutamente toda mi existencia. Así que, obviamente, necesito café.",
    imageSrc: "images/scene-02.png",
    accentColor: "#16213e",
    enter: "shake",
  },
  {
    id: "scene-03",
    startFrame: 210,
    durationInFrames: 120,
    caption:
      "Pero no cualquier café. Ese elixir divino que me transforma de un zombie gruñón...",
    imageSrc: "images/scene-03.png",
    accentColor: "#7a1f1f",
    enter: "pop",
  },
  {
    id: "scene-04",
    startFrame: 330,
    durationInFrames: 120,
    caption:
      "...en un ser humano funcional capaz de conquistar el mundo. O al menos de contestar correos.",
    imageSrc: "images/scene-04.png",
    accentColor: "#3b1f4d",
    enter: "slideStagger",
  },
  {
    id: "scene-05",
    startFrame: 450,
    durationInFrames: 150,
    caption:
      "Llego a la cocina, con la ilusión al máximo... y descubro la peor tragedia moderna.",
    imageSrc: "images/scene-05.png",
    accentColor: "#33424f",
    enter: "pop",
  },
  {
    id: "scene-06",
    startFrame: 600,
    durationInFrames: 120,
    caption: "Alguien... se terminó el café y dejó el frasco vacío en la alacena.",
    imageSrc: "images/scene-06.png",
    accentColor: "#4a4030",
    enter: "shake",
  },
  {
    id: "scene-07",
    startFrame: 720,
    durationInFrames: 150,
    caption: "¿Quién hace eso? ¡Eso es traición a la patria! ¡Es un crimen de guerra!",
    imageSrc: "images/scene-07.png",
    accentColor: "#6e1414",
    enter: "shake",
  },
  {
    id: "scene-08",
    startFrame: 870,
    durationInFrames: 150,
    caption: "Empieza la investigación criminal en la casa. Sospechosos: todos.",
    imageSrc: "images/scene-08.png",
    accentColor: "#5a3d23",
    enter: "slideStagger",
  },
  {
    id: "scene-09",
    startFrame: 1020,
    durationInFrames: 150,
    caption:
      "Hasta que recuerdo... que el que se lo terminó anoche para terminar un proyecto... fui yo.",
    imageSrc: "images/scene-09.png",
    accentColor: "#2e2a4d",
    enter: "pop",
  },
  {
    id: "scene-10",
    startFrame: 1170,
    durationInFrames: 180,
    caption:
      "En fin, me toca ir a la cafetería local a gastar dinero que no tengo. Sígueme si también eres un esclavo de la cafeína.",
    imageSrc: "images/scene-10.png",
    accentColor: "#332940",
    enter: "pop",
  },
];
