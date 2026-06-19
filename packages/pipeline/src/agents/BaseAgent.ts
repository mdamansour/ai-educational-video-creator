import { globalLogger } from "shared";
import { GeminiService } from "gemini-service";
import { z } from "zod";

export abstract class BaseAgent<TInput, TOutput> {
  protected abstract readonly agentName: string;
  protected gemini: GeminiService;
  protected maxRetries = 3;

  constructor(apiKey: string) {
    this.gemini = new GeminiService(apiKey);
  }

  /**
   * Generates the prompt string for this specific agent based on the input.
   */
  protected abstract buildPrompt(input: TInput, errorContext?: string): string;

  /**
   * Provides the Zod schema used to validate the LLM's response.
   */
  protected abstract getOutputSchema(): z.ZodType<TOutput>;

  /**
   * Executes the agent's core task, complete with automatic retries and Zod validation.
   */
  public async execute(input: TInput): Promise<TOutput> {
    let lastError: Error | null = null;
    let errorContext = "";

    globalLogger.info(this.agentName, `Executing task...`);

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      globalLogger.debug(this.agentName, `Attempt ${attempt}/${this.maxRetries}`);
      
      const prompt = this.buildPrompt(input, errorContext);
      const schema = this.getOutputSchema();

      try {
        // Attempt to generate and validate
        const result = await this.gemini.generateStructured<TOutput>(prompt, schema);
        globalLogger.info(this.agentName, `Task completed successfully on attempt ${attempt}`);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        globalLogger.warn(this.agentName, `Attempt ${attempt} failed: ${lastError.message}`, {
          attemptNumber: attempt,
          prompt,
          error: lastError.message,
        });

        // Prepare the error context to inject into the next prompt
        errorContext = `PREVIOUS ATTEMPT FAILED. The JSON you returned was invalid. Please fix the following errors:\n${lastError.message}`;
      }
    }

    globalLogger.error(this.agentName, `All ${this.maxRetries} attempts failed.`);
    throw lastError || new Error("Task failed after maximum retries");
  }
}
