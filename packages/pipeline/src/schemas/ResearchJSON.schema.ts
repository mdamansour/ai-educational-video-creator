import { z } from "zod";

export const ConceptSchema = z.object({
  name: z.string(),
  definition: z.string(),
});

export const LatexFormulaSchema = z.object({
  name: z.string(),
  latex: z.string(),
  explanation: z.string(),
});

export const AnalogySchema = z.object({
  analogy: z.string(),
  explanation: z.string(),
});

export const MisconceptionSchema = z.object({
  misconception: z.string(),
  reality: z.string(),
});

export const ResearchJSONSchema = z.object({
  summary: z.string(),
  concepts: z.array(ConceptSchema).min(3).max(7),
  latexFormulas: z.array(LatexFormulaSchema),
  analogies: z.array(AnalogySchema).length(2),
  misconceptions: z.array(MisconceptionSchema).length(2),
});

export type ResearchJSON = z.infer<typeof ResearchJSONSchema>;
