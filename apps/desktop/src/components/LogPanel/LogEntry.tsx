import React, { useState } from "react";
import type { LogEntry as LogEntryType } from "shared";
import { ChevronRight, ChevronDown } from "lucide-react";
import clsx from "clsx";

interface Props {
  entry: LogEntryType;
}

const levelColors = {
  DEBUG: "text-gray-500",
  INFO: "text-blue-500",
  WARN: "text-yellow-500",
  ERROR: "text-red-500",
  FATAL: "text-purple-600 font-bold",
};

export const LogEntry: React.FC<Props> = ({ entry }) => {
  const [expanded, setExpanded] = useState(false);
  const time = new Date(entry.timestamp).toLocaleTimeString();

  return (
    <div className="flex flex-col py-1 border-b border-gray-100 font-mono text-sm">
      <div className="flex items-start gap-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <span className="text-gray-400 min-w-[70px] shrink-0">{time}</span>
        <span className={clsx("min-w-[50px] font-semibold shrink-0", levelColors[entry.level])}>
          {entry.level}
        </span>
        <span className="text-gray-600 min-w-[120px] shrink-0 truncate">{entry.source}</span>
        <span className="text-gray-800 flex-1">{entry.message}</span>
        {entry.metadata && (
          <span className="text-gray-400 shrink-0">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
      </div>
      
      {expanded && entry.metadata && (
        <div className="mt-2 ml-[260px] bg-gray-50 p-2 rounded text-xs text-gray-700 overflow-x-auto">
          <pre>{JSON.stringify(entry.metadata, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
