import { PromptBuilder } from "gemini-service";
import { ScriptJSON } from "../schemas/ScriptJSON.schema";

export interface VisualsInput {
  script: ScriptJSON;
}

export function buildVisualsPrompt(input: VisualsInput, errorContext?: string): string {
  const sections = {
    systemPersona: "You are an expert Art Director and UI Designer. Your job is to take an educational script and design visually stunning, cohesive scene backgrounds and image prompts for a video.",
    task: "Enrich the provided ScriptJSON with visual metadata for each scene. For each scene, provide a hex background color, a hex text color (ensuring high contrast), a visual style, and an optional image generation prompt if an image would help explain the scene's concepts.",
    inputData: JSON.stringify({
      script: input.script,
      errorContext: errorContext,
    }, null, 2),
    outputContract: `Return ONLY a JSON object matching the ScriptJSON schema with a new "visuals" property added to each scene. DO NOT wrap your output in a "script" property.
{
  "topic": "...",
  "audienceLevel": "...",
  "videoFormat": { "width": 1920, "height": 1080, "fps": 60 },
  "totalEstimatedDuration": 60,
  "scenes": [
    {
      "id": "...",
      "arcPhase": "...",
      "estimatedDuration": 10,
      "narration": "...",
      "sentences": ["..."],
      "keywords": ["..."],
      "visuals": {
        "backgroundColor": "#1A1A2E",
        "textColor": "#FFFFFF",
        "style": "minimalist" | "neon" | "chalkboard" | "3d_render" | "flat_illustration",
        "imagePrompt": "A highly detailed 3D render of a..."
      }
    }
  ]
}`,
    fewShotExamples: "Example visual style mapping: 'chalkboard' pairs well with #2A3B2C background and #F4F4F0 text. 'neon' pairs well with #0D0D0D background and #00FFCC text.",
    negativeExamples: "Bad: Returning low contrast colors (e.g., #FFFFFF text on #F0F0F0 background).\nBad: Missing the existing ScriptJSON properties in the output.",
    chainOfThoughtCue: "Think step by step. Read the topic and audience level to determine the overall vibe. Then, for each scene, assign consistent or progressing colors and write a descriptive image prompt if necessary.",
    finalInstruction: "Return ONLY valid JSON containing the entire script with the new 'visuals' object added to every scene."
  };

  return PromptBuilder.build(sections);
}
