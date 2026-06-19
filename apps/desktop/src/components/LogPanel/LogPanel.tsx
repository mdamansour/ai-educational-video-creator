import React, { useState, useEffect, useRef } from "react";
import type { LogLevel } from "shared";
import { useLogStore } from "../../store/logStore";
import { LogEntry } from "./LogEntry";
import { LogToolbar } from "./LogToolbar";

export const LogPanel: React.FC = () => {
  const { logs } = useLogStore();
  const [filters, setFilters] = useState<Set<LogLevel>>(new Set(["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]));
  const listRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (level: LogLevel) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };

  const filteredLogs = logs.filter((log) => filters.has(log.level));

  // Auto-scroll to bottom
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [filteredLogs.length]);

  return (
    <div className="flex flex-col h-64 bg-white border-t border-gray-300 shadow-inner">
      <LogToolbar filters={filters} toggleFilter={toggleFilter} />
      <div ref={listRef} className="flex-1 overflow-y-auto bg-white p-2">
        {filteredLogs.map((entry) => (
          <LogEntry key={entry.id} entry={entry} />
        ))}
        {filteredLogs.length === 0 && (
          <div className="text-gray-400 text-sm italic py-4 text-center">No logs matching the selected filters.</div>
        )}
      </div>
    </div>
  );
};
