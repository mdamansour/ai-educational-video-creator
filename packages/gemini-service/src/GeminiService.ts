import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { globalLogger } from "shared";

export class GeminiService {
  private ai: GoogleGenAI;
  private defaultModel = "gemini-2.5-flash";

  constructor(apiKey?: string) {
    const envKey = typeof process !== "undefined" && process.env ? process.env.GEMINI_API_KEY : undefined;
    const key = apiKey || envKey;
    
    if (!key) {
      globalLogger.error("GeminiService", "No API key provided. Set GEMINI_API_KEY environment variable.");
    }
    
    // Initialize the new Google Gen AI SDK
    this.ai = new GoogleGenAI({ apiKey: key || "" });
    globalLogger.info("GeminiService", "Initialized GoogleGenAI client");
  }

  /**
   * Generates content using the specified prompt
   */
  public async generate(prompt: string, model?: string): Promise<string> {
    const targetModel = model || this.defaultModel;
    globalLogger.debug("GeminiService", `Generating content with ${targetModel}...`);

    try {
      const response = await this.ai.models.generateContent({
        model: targetModel,
        contents: prompt,
      });

      if (!response.text) {
        throw new Error("Empty response received from Gemini.");
      }

      globalLogger.info("GeminiService", `Successfully generated content from ${targetModel}`);
      return response.text;
    } catch (error) {
      globalLogger.error("GeminiService", "Generation failed", { 
        error: error instanceof Error ? error.message : String(error),
        prompt 
      });
      throw error;
    }
  }

  /**
   * Generates structured content and validates it against a Zod schema
   */
  public async generateStructured<T>(prompt: string, schema: z.ZodSchema<T>, model?: string): Promise<T> {
    const targetModel = model || this.defaultModel;
    globalLogger.debug("GeminiService", `Generating structured content with ${targetModel}...`);

    try {
      // In a real implementation we might use response_schema from the API if supported, 
      // but for flexibility we'll ask for JSON and parse it manually.
      const fullPrompt = `${prompt}\n\nReturn ONLY a valid JSON object matching the requested schema. Do not wrap in markdown code blocks.`;
      
      const response = await this.ai.models.generateContent({
        model: targetModel,
        contents: fullPrompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      if (!response.text) {
        throw new Error("Empty response received from Gemini.");
      }

      // Parse JSON
      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(response.text);
      } catch (parseError) {
        globalLogger.error("GeminiService", "Failed to parse JSON", { 
          rawResponse: response.text, 
          prompt: fullPrompt 
        });
        throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }

      // Validate against Zod schema
      const result = schema.safeParse(parsedJson);
      if (!result.success) {
        globalLogger.error("GeminiService", "Zod validation failed", {
          zodErrors: result.error.issues,
          rawResponse: response.text,
          prompt: fullPrompt
        });
        throw new Error(`Output failed schema validation: ${JSON.stringify(result.error.issues)}`);
      }

      globalLogger.info("GeminiService", `Successfully generated and validated structured content from ${targetModel}`);
      return result.data;
    } catch (error) {
      globalLogger.error("GeminiService", "Structured generation failed", { 
        error: error instanceof Error ? error.message : String(error),
        prompt 
      });
      throw error;
    }
  }

  /**
   * Lists available models using the new API
   */
  public async listModels(): Promise<string[]> {
    globalLogger.debug("GeminiService", "Listing available models...");
    try {
      // Using paginated models list from GenAI SDK
      const models = [];
      const pager = await this.ai.models.list();
      // Use any to bypass strict pager typings for now, just extract the names
      for await (const model of (pager as any)) {
        if (model.name) models.push(model.name);
      }
      globalLogger.info("GeminiService", `Found ${models.length} available models`);
      return models;
    } catch (error) {
      globalLogger.error("GeminiService", "Failed to list models", { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }
}
