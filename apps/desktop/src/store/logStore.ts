import { create } from "zustand";
import type { LogEntry, LogLevel } from "shared";

interface LogStore {
  logs: LogEntry[];
  lastError: LogEntry | null;
  addLog: (entry: LogEntry) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  lastError: null,
  addLog: (entry) =>
    set((state) => {
      const isError = entry.level === "ERROR" || entry.level === "FATAL";
      return {
        logs: [...state.logs, entry],
        lastError: isError ? entry : state.lastError,
      };
    }),
  clearLogs: () => set({ logs: [], lastError: null }),
}));
