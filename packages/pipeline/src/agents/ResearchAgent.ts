import { z } from "zod";
import { BaseAgent } from "./BaseAgent";
import { buildResearchPrompt, ResearchInput } from "../prompts/research.prompt";
import { ResearchJSON, ResearchJSONSchema } from "../schemas/ResearchJSON.schema";

export class ResearchAgent extends BaseAgent<ResearchInput, ResearchJSON> {
  protected override readonly agentName = "ResearchAgent";

  protected override buildPrompt(input: ResearchInput, errorContext?: string): string {
    return buildResearchPrompt(input, errorContext);
  }

  protected override getOutputSchema(): z.ZodType<ResearchJSON> {
    return ResearchJSONSchema;
  }
}
