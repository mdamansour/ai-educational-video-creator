import { ScriptJSON } from "./ScriptJSON";
import { ScenePlanJSON } from "./ScenePlanJSON";

export enum PipelineStep {
  TopicFormat = 1,
  Research = 2,
  Scenario = 3,
  Script = 4,
  KaraokeRecording = 5,
  MCEditor = 6,
  AudioMix = 7,
  Render = 8,
  Export = 9,
}

export interface PipelineState {
  step: PipelineStep;
  topic?: string;
  audienceLevel?: "middle" | "high_school" | "university" | "graduate";
  formatPreset?: string;
  researchOutput?: unknown; // Defined further later
  scriptJSON?: ScriptJSON;
  scenePlanJSON?: ScenePlanJSON;
  generatedFiles?: string[];
  reviewedFiles?: string[];
  renderedVideoPath?: string;
  exportedFiles?: {
    videoPath?: string;
    srtPath?: string;
  };
}
