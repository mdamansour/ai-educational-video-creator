export interface AgentResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    durationMs: number;
    attempts: number;
  };
}
