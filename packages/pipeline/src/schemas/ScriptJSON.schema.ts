import { z } from "zod";

export const ScriptSceneSchema = z.object({
  id: z.string(),
  arcPhase: z.enum(["hook", "buildup", "aha", "payoff"]),
  estimatedDuration: z.number().min(5, "Duration must be at least 5 seconds"),
  narration: z.string(),
  sentences: z.array(z.string()).min(1, "Must have at least one sentence for karaoke"),
  onScreenText: z.string().optional(),
  latexFormula: z.string().optional(),
  keywords: z.array(z.string()),
  locked: z.boolean().optional(),
});

export const ScriptJSONSchema = z.object({
  topic: z.string(),
  audienceLevel: z.enum(["middle", "high_school", "university", "graduate"]),
  videoFormat: z.object({
    width: z.number(),
    height: z.number(),
    fps: z.number(),
  }),
  totalEstimatedDuration: z.number(),
  scenes: z.array(ScriptSceneSchema).min(1, "Must have at least one scene"),
});

export type ScriptJSON = z.infer<typeof ScriptJSONSchema>;
export type ScriptScene = z.infer<typeof ScriptSceneSchema>;
