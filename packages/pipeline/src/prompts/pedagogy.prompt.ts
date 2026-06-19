import { PromptBuilder } from "gemini-service";
import { ResearchJSON } from "../schemas/ResearchJSON.schema";

export interface PedagogyInput {
  topic: string;
  audienceLevel: string;
  videoFormat: { width: number; height: number; fps: number };
  totalEstimatedDuration: number;
  research: ResearchJSON;
}

export function buildPedagogyPrompt(input: PedagogyInput, errorContext?: string): string {
  const sections = {
    systemPersona: "You are a master Instructional Designer. You turn raw research into an engaging, narrated script with a clear 4-phase learning arc (hook, buildup, aha, payoff). Your script is broken down into precise, timestamped scenes.",
    task: `Write a video script about "${input.topic}" for an audience at the "${input.audienceLevel}" level. The target video duration is ${input.totalEstimatedDuration} seconds. Use the provided research. Ensure you include exactly all 4 arc phases.`,
    inputData: JSON.stringify({
      topic: input.topic,
      audienceLevel: input.audienceLevel,
      format: input.videoFormat,
      targetDuration: input.totalEstimatedDuration,
      research: input.research,
      errorContext: errorContext,
    }, null, 2),
    outputContract: `Return ONLY a JSON object matching this schema:
{
  "topic": string,
  "audienceLevel": string,
  "videoFormat": { "width": number, "height": number, "fps": number },
  "totalEstimatedDuration": number,
  "scenes": [
    {
      "id": "scene_01",
      "arcPhase": "hook" | "buildup" | "aha" | "payoff",
      "estimatedDuration": number, // minimum 5 seconds
      "narration": string, // full spoken text
      "sentences": string[], // narration split into individual sentences for karaoke
      "onScreenText": string (optional),
      "latexFormula": string (optional),
      "keywords": string[]
    }
  ]
}`,
    fewShotExamples: JSON.stringify([
      {
        input: {
          topic: "Photosynthesis",
          audienceLevel: "middle",
          targetDuration: 20,
        },
        output: {
          topic: "Photosynthesis",
          audienceLevel: "middle",
          videoFormat: { width: 1920, height: 1080, fps: 60 },
          totalEstimatedDuration: 20,
          scenes: [
            {
              id: "scene_01",
              arcPhase: "hook",
              estimatedDuration: 6,
              narration: "Have you ever wondered how plants eat without mouths?",
              sentences: ["Have you ever wondered how plants eat without mouths?"],
              keywords: ["plants", "eating"]
            },
            {
              id: "scene_02",
              arcPhase: "buildup",
              estimatedDuration: 6,
              narration: "They actually use a magical green ingredient called chlorophyll to trap sunlight.",
              sentences: ["They actually use a magical green ingredient called chlorophyll to trap sunlight."],
              keywords: ["chlorophyll", "sunlight"]
            },
            {
              id: "scene_03",
              arcPhase: "aha",
              estimatedDuration: 6,
              narration: "It's just like baking a cake! They mix water, air, and sunshine to make sugar.",
              sentences: ["It's just like baking a cake!", "They mix water, air, and sunshine to make sugar."],
              keywords: ["baking", "cake", "sugar"]
            },
            {
              id: "scene_04",
              arcPhase: "payoff",
              estimatedDuration: 5,
              narration: "So every leaf you see is actually a tiny solar-powered bakery.",
              sentences: ["So every leaf you see is actually a tiny solar-powered bakery."],
              keywords: ["leaf", "bakery"]
            }
          ]
        }
      }
    ], null, 2),
    negativeExamples: "Bad: Creating a scene shorter than 5 seconds.\nBad: Forgetting to split the narration into an array of sentences.\nBad: Missing one of the four arc phases (hook, buildup, aha, payoff).",
    chainOfThoughtCue: "Think step by step. First calculate the rough time budget for each of the 4 arc phases. Then draft the narration, ensuring it covers the concepts and analogies. Finally, split the narration into sentences.",
    finalInstruction: "Return ONLY valid JSON. No markdown. No extra keys. No commentary."
  };

  return PromptBuilder.build(sections);
}
