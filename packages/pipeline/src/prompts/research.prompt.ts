import { PromptBuilder } from "gemini-service";

export interface ResearchInput {
  topic: string;
  audienceLevel: string;
}

export function buildResearchPrompt(input: ResearchInput, errorContext?: string): string {
  const sections = {
    systemPersona: "You are an expert Educational Researcher. Your job is to break down complex topics into core concepts, find clear analogies, and identify common misconceptions.",
    task: `Research the topic "${input.topic}" for an audience at the "${input.audienceLevel}" level. Extract 3-7 core concepts, relevant LaTeX formulas, 2 clear analogies, and 2 common misconceptions.`,
    inputData: JSON.stringify({
      topic: input.topic,
      audienceLevel: input.audienceLevel,
      errorContext: errorContext,
    }, null, 2),
    outputContract: `Return ONLY a JSON object matching this schema:
{
  "summary": "Brief 2-3 sentence summary",
  "concepts": [
    { "name": "Concept Name", "definition": "Clear definition" }
  ],
  "latexFormulas": [
    { "name": "Formula Name", "latex": "e.g. E = mc^2", "explanation": "What it means" }
  ],
  "analogies": [
    { "analogy": "It's like a...", "explanation": "Why this analogy works" }
  ],
  "misconceptions": [
    { "misconception": "People often think...", "reality": "But actually..." }
  ]
}`,
    fewShotExamples: JSON.stringify([
      {
        input: { topic: "Photosynthesis", audienceLevel: "middle" },
        output: {
          summary: "Photosynthesis is the process by which plants use sunlight to make their own food.",
          concepts: [
            { name: "Chlorophyll", definition: "The green pigment in plants that absorbs sunlight." }
          ],
          latexFormulas: [],
          analogies: [
            { analogy: "It's like baking a cake", explanation: "You need ingredients (water, CO2) and an oven (sunlight) to make the cake (sugar)." }
          ],
          misconceptions: [
            { misconception: "Plants get their food from soil.", reality: "Soil provides nutrients, but plants make their own actual food (sugar) from air and water using sunlight." }
          ]
        }
      }
    ], null, 2),
    negativeExamples: "Bad: Making up a fake formula.\nBad: Writing a summary that is too academic for a middle school audience.",
    chainOfThoughtCue: "Think step by step about what the core learning objectives are for this topic before listing concepts.",
    finalInstruction: "Return ONLY valid JSON. No markdown. No extra keys. No commentary."
  };

  return PromptBuilder.build(sections);
}
