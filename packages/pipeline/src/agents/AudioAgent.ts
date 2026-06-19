import { z } from "zod";
import { BaseAgent } from "./BaseAgent";
import { buildAudioPrompt, AudioInput } from "../prompts/audio.prompt";
import { AssetJSON, AssetJSONSchema } from "../schemas/AssetJSON.schema";

export class AudioAgent extends BaseAgent<AudioInput, AssetJSON> {
  protected override readonly agentName = "AudioAgent";

  protected override buildPrompt(input: AudioInput, errorContext?: string): string {
    return buildAudioPrompt(input, errorContext);
  }

  protected override getOutputSchema(): z.ZodType<AssetJSON> {
    return AssetJSONSchema;
  }
}
