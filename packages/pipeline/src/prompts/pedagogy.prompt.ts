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
    systemPersona: "You are a viral TikTok/Shorts scriptwriter. You turn raw research into a hyper-stimulating, fast-paced 'brain rot' video script. The script must have an aggressive hook, rapid-fire buildup, a mind-blowing aha moment, and a quick payoff. Your scenes should be short (3-8 seconds) to match a highly distracted audience. Use Gen-Z/Alpha slang naturally and keep the energy at 100%.",
    task: `Write a high-energy, fast-paced video script about "${input.topic}" for an audience at the "${input.audienceLevel}" level. The target video duration is ${input.totalEstimatedDuration} seconds. Use the provided research. Ensure you include exactly all 4 arc phases. Make the narration punchy, use slang appropriately, and split sentences aggressively.`,
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
      "estimatedDuration": number, // minimum 3 seconds
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
              estimatedDuration: 4,
              narration: "Bro, plants are literally eating thin air right now and you didn't even notice. 💀",
              sentences: ["Bro, plants are literally eating thin air right now and you didn't even notice. 💀"],
              keywords: ["plants", "air", "eating"]
            },
            {
              id: "scene_02",
              arcPhase: "buildup",
              estimatedDuration: 6,
              narration: "Inside a leaf is a tiny solar-powered kitchen called a chloroplast. They use chlorophyll to trap sunlight like a cheat code.",
              sentences: ["Inside a leaf is a tiny solar-powered kitchen called a chloroplast.", "They use chlorophyll to trap sunlight like a cheat code."],
              keywords: ["chloroplast", "cheat code"]
            },
            {
              id: "scene_03",
              arcPhase: "aha",
              estimatedDuration: 6,
              narration: "They mix water, air, and sunshine to craft sugar. It's literally just real-life Minecraft crafting.",
              sentences: ["They mix water, air, and sunshine to craft sugar.", "It's literally just real-life Minecraft crafting."],
              keywords: ["minecraft", "crafting", "sugar"]
            },
            {
              id: "scene_04",
              arcPhase: "payoff",
              estimatedDuration: 4,
              narration: "So next time you see a tree, remember it's a massive solar battery carrying the whole server. W tree.",
              sentences: ["So next time you see a tree, remember it's a massive solar battery carrying the whole server.", "W tree."],
              keywords: ["battery", "server", "W"]
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
