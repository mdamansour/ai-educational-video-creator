import { VideoFormat } from "./VideoFormat";

export type VisualType =
  | "geometry"
  | "graph_plot"
  | "particle_system"
  | "text_reveal"
  | "equation_build"
  | "metaphor_scene"
  | "number_line"
  | "code_block";

export type MCComponent =
  | "Rect"
  | "Circle"
  | "Line"
  | "Txt"
  | "Latex"
  | "Layout"
  | "Grid"
  | "Node"
  | "Video"
  | "Img";

export type AnimationStyle =
  | "draw-in"
  | "morph"
  | "fade-in"
  | "particle-burst"
  | "slide-up"
  | "scale-in";

export type CameraMovement =
  | "zoom-in"
  | "zoom-out"
  | "pan-right"
  | "pan-left"
  | "pan-up"
  | "pan-down"
  | "none";

export interface ScenePlan {
  sceneId: string;
  visualType: VisualType;
  sourceOfTruth: "ai_generated" | "user_edited" | "ai_readback";
  lastReadFromDisk?: string;           // ISO timestamp of last SceneReadBackAgent run
  motionCanvasHints: {
    components: MCComponent[];
    animationStyle: AnimationStyle;
    colorPalette: string[];
    cameraMovement?: CameraMovement;
  };
  estimatedDuration: number;
  scriptRef: string;
  locked: boolean;
}

export interface ScenePlanJSON {
  videoFormat: VideoFormat;
  scenes: ScenePlan[];
}
