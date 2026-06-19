import { FormatPreset } from "./VideoFormat";

export interface ScriptScene {
  id: string;                       // "scene_01", "scene_02", ...
  arcPhase: "hook" | "buildup" | "aha" | "payoff";
  estimatedDuration: number;        // seconds >= 5
  narration: string;                // spoken text (recorded by user)
  sentences: string[];              // narration split into sentences for karaoke
  onScreenText?: string;
  latexFormula?: string;
  keywords: string[];
  locked?: boolean;                 // user-locked in MC editor
}

export interface ScriptJSON {
  topic: string;
  audienceLevel: "middle" | "high_school" | "university" | "graduate";
  videoFormat: FormatPreset;
  totalEstimatedDuration: number;   // seconds
  scenes: ScriptScene[];
}
