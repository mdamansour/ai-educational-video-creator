export interface PromptSections {
  systemPersona: string;
  task: string;
  inputData?: string;
  outputContract: string;
  fewShotExamples?: string;
  negativeExamples?: string;
  chainOfThoughtCue?: string;
  finalInstruction: string;
}

export class PromptBuilder {
  /**
   * Constructs the mandatory 8-section prompt template
   */
  public static build(sections: PromptSections): string {
    const parts: string[] = [];

    parts.push(`=== 1. SYSTEM PERSONA ===\n${sections.systemPersona}\n`);
    parts.push(`=== 2. TASK ===\n${sections.task}\n`);
    
    if (sections.inputData) {
      parts.push(`=== 3. INPUT DATA ===\n${sections.inputData}\n`);
    }
    
    parts.push(`=== 4. OUTPUT CONTRACT ===\n${sections.outputContract}\n`);
    
    if (sections.fewShotExamples) {
      parts.push(`=== 5. EXAMPLES ===\n${sections.fewShotExamples}\n`);
    }
    
    if (sections.negativeExamples) {
      parts.push(`=== 6. DO NOT DO THIS ===\n${sections.negativeExamples}\n`);
    }
    
    if (sections.chainOfThoughtCue) {
      parts.push(`=== 7. THINKING PROCESS ===\n${sections.chainOfThoughtCue}\n`);
    }
    
    parts.push(`=== 8. FINAL INSTRUCTION ===\n${sections.finalInstruction}\n`);

    return parts.join("\n");
  }
}
