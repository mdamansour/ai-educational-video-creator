import { z } from "zod";
import { ScriptSceneSchema, ScriptJSONSchema } from "./ScriptJSON.schema";

export const SceneVisualsSchema = z.object({
  backgroundColor: z.string().describe("Hex color code for background"),
  textColor: z.string().describe("Hex color code for text"),
  style: z.enum(["minimalist", "neon", "chalkboard", "3d_render", "flat_illustration"]),
  imagePrompt: z.string().optional().describe("Prompt for image generation, if an image is needed"),
});

export const VisualsJSONSchema = ScriptJSONSchema.extend({
  scenes: z.array(ScriptSceneSchema.extend({
    visuals: SceneVisualsSchema,
  })).min(1),
});

export type VisualsJSON = z.infer<typeof VisualsJSONSchema>;

export const KaraokeTimingSchema = z.object({
  sentence: z.string(),
  startAt: z.number().describe("Start time in seconds"),
  endAt: z.number().describe("End time in seconds"),
});

export const AssetJSONSchema = VisualsJSONSchema.extend({
  scenes: z.array(ScriptSceneSchema.extend({
    visuals: SceneVisualsSchema,
    karaokeTimings: z.array(KaraokeTimingSchema),
  })).min(1),
});

export type AssetJSON = z.infer<typeof AssetJSONSchema>;
export type SceneVisuals = z.infer<typeof SceneVisualsSchema>;
export type KaraokeTiming = z.infer<typeof KaraokeTimingSchema>;
