export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

export interface LogEntry {
  id: string;                    // uuid
  timestamp: string;             // ISO-8601
  level: LogLevel;
  source: string;                // e.g. "ResearchAgent", "MCDevServer", "Recorder"
  message: string;
  metadata?: {
    prompt?: string;             // Full prompt sent to Gemini (on failure)
    rawResponse?: string;        // Raw LLM response (on failure)
    zodErrors?: string[];        // Validation errors
    filePath?: string;
    durationMs?: number;
    attemptNumber?: number;
    [key: string]: unknown;
  };
}
