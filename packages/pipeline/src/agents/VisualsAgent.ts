import { z } from "zod";
import { BaseAgent } from "./BaseAgent";
import { buildVisualsPrompt, VisualsInput } from "../prompts/visuals.prompt";
import { VisualsJSON, VisualsJSONSchema } from "../schemas/AssetJSON.schema";

export class VisualsAgent extends BaseAgent<VisualsInput, VisualsJSON> {
  protected override readonly agentName = "VisualsAgent";

  protected override buildPrompt(input: VisualsInput, errorContext?: string): string {
    return buildVisualsPrompt(input, errorContext);
  }

  protected override getOutputSchema(): z.ZodType<VisualsJSON> {
    return VisualsJSONSchema;
  }
}
