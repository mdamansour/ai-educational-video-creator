import { LogEntry, LogLevel } from "../types/LogEntry";

// Helper to generate a UUID-like string
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export type LogListener = (entry: LogEntry) => void;

export class Logger {
  private queue: LogEntry[] = [];
  private isProcessing = false;
  private listeners: Set<LogListener> = new Set();
  private logFilePath?: string;
  private fileWriter?: (path: string, data: string) => Promise<void>;

  constructor() {}

  public setFileWriter(filePath: string, writer: (path: string, data: string) => Promise<void>) {
    this.logFilePath = filePath;
    this.fileWriter = writer;
  }

  public subscribe(listener: LogListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const entry = this.queue.shift();
      if (!entry) continue;

      // Emit to listeners
      this.listeners.forEach((listener) => {
        try {
          listener(entry);
        } catch (e) {
          console.error("Log listener error:", e);
        }
      });

      // Write to file if configured
      if (this.logFilePath && this.fileWriter) {
        try {
          await this.fileWriter(this.logFilePath, JSON.stringify(entry) + "\n");
        } catch (e) {
          console.error("Failed to write log to file:", e);
        }
      }
    }

    this.isProcessing = false;
  }

  public log(level: LogLevel, source: string, message: string, metadata?: Record<string, unknown>) {
    const entry: LogEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
      metadata,
    };

    this.queue.push(entry);
    this.processQueue().catch(console.error);
  }

  public debug(source: string, message: string, metadata?: Record<string, unknown>) {
    this.log("DEBUG", source, message, metadata);
  }

  public info(source: string, message: string, metadata?: Record<string, unknown>) {
    this.log("INFO", source, message, metadata);
  }

  public warn(source: string, message: string, metadata?: Record<string, unknown>) {
    this.log("WARN", source, message, metadata);
  }

  public error(source: string, message: string, metadata?: Record<string, unknown>) {
    this.log("ERROR", source, message, metadata);
  }

  public fatal(source: string, message: string, metadata?: Record<string, unknown>) {
    this.log("FATAL", source, message, metadata);
  }
}

export const globalLogger = new Logger();
