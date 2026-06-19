import { z } from "zod";
import { BaseAgent } from "./BaseAgent";
import { buildPedagogyPrompt, PedagogyInput } from "../prompts/pedagogy.prompt";
import { ScriptJSON, ScriptJSONSchema } from "../schemas/ScriptJSON.schema";

export class PedagogyAgent extends BaseAgent<PedagogyInput, ScriptJSON> {
  protected override readonly agentName = "PedagogyAgent";

  protected override buildPrompt(input: PedagogyInput, errorContext?: string): string {
    return buildPedagogyPrompt(input, errorContext);
  }

  protected override getOutputSchema(): z.ZodType<ScriptJSON> {
    return ScriptJSONSchema;
  }
}
