import { PromptBuilder } from "gemini-service";
import { VisualsJSON } from "../schemas/AssetJSON.schema";

export interface AudioInput {
  visuals: VisualsJSON;
}

export function buildAudioPrompt(input: AudioInput, errorContext?: string): string {
  const sections = {
    systemPersona: "You are an expert Audio Engineer and timing specialist. We do not have a real TTS engine yet, so your job is to mock it by generating realistic start and end timestamps for every sentence in the script so that our UI can highlight text like a Karaoke machine.",
    task: "For each scene in the provided VisualsJSON, calculate realistic word timings. Assume an average speaking rate of 150 words per minute (2.5 words per second). Add a `karaokeTimings` array to every scene containing the start and end times in seconds for every sentence. Ensure the first sentence of the first scene starts at 0, and subsequent sentences follow consecutively.",
    inputData: JSON.stringify({
      visuals: input.visuals,
      errorContext: errorContext,
    }, null, 2),
    outputContract: `Return ONLY a JSON object matching the VisualsJSON schema with a new "karaokeTimings" property added to each scene. DO NOT wrap your output in a "visuals" property.
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
      "visuals": { ... },
      "karaokeTimings": [
        {
          "sentence": "The exact sentence string",
          "startAt": 0.0,
          "endAt": 4.5
        }
      ]
    }
  ]
}`,
    fewShotExamples: "If a scene has two sentences with 10 words each, they might each take 4 seconds. Sentence 1: startAt: 0, endAt: 4. Sentence 2: startAt: 4.5, endAt: 8.5.",
    negativeExamples: "Bad: Returning overlapping times (sentence 2 starts before sentence 1 ends).\nBad: Missing sentences from the original script.",
    chainOfThoughtCue: "Think step by step. Track the cumulative 'currentTime' variable. For each sentence, estimate its duration based on word count (duration = wordCount / 2.5). Add a small 0.5s pause between sentences.",
    finalInstruction: "Return ONLY valid JSON containing the entire script with the new 'karaokeTimings' array added to every scene."
  };

  return PromptBuilder.build(sections);
}
