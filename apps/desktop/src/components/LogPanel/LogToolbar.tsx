import React from "react";
import type { LogLevel } from "shared";
import { Copy, Trash2, AlertTriangle } from "lucide-react";
import { useLogStore } from "../../store/logStore";

interface Props {
  filters: Set<LogLevel>;
  toggleFilter: (level: LogLevel) => void;
}

export const LogToolbar: React.FC<Props> = ({ filters, toggleFilter }) => {
  const { logs, lastError, clearLogs } = useLogStore();

  const handleCopyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
  };

  const handleCopyLastError = () => {
    if (lastError) {
      navigator.clipboard.writeText(JSON.stringify(lastError, null, 2));
    }
  };

  const levels: LogLevel[] = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"];

  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-300">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm text-gray-700 mr-2">LOGS</span>
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => toggleFilter(level)}
            className={`px-2 py-1 text-xs font-semibold rounded ${
              filters.has(level)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {level}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          <Copy size={14} /> Copy All
        </button>
        <button
          onClick={handleCopyLastError}
          disabled={!lastError}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-white border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
        >
          <AlertTriangle size={14} /> Copy Error
        </button>
        <button
          onClick={clearLogs}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>
    </div>
  );
};
