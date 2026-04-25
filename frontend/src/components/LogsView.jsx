import LogRow from "./LogRow";

export default function LogsView({ logs }) {
  const getLogKey = (log, index) =>
    log._id || log.logId || `${log.createdAt || "no-timestamp"}-${log.service || "unknown"}-${index}`;

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 [scrollbar-gutter:stable]">
      <div className="flex flex-col gap-2">
        {logs.length > 0 ? (
          logs.map((log, index) => <LogRow key={getLogKey(log, index)} log={log} />)
        ) : (
          <div className="theme-empty flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="theme-text-faint mb-4 h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="theme-text-secondary text-sm font-medium">No telemetry streams detected</p>
            <p className="theme-text-muted mt-1 text-xs">
              Waiting for system logs to initialize...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
