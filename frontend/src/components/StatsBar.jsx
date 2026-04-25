export default function StatsBar({ logs, latestIncident }) {
  const totalLogs = logs.length;
  const errorCount = logs.filter((log) => log.level === "error").length;
  const highSeverityCount = logs.filter((log) => log.severity === "high").length;
  const errorRate = totalLogs === 0 ? "0.00%" : `${((errorCount / totalLogs) * 100).toFixed(2)}%`;

  const stats = [
    {
      label: "TOTAL STREAMS",
      value: totalLogs.toLocaleString(),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      label: "ERROR RATE",
      value: errorRate,
      color: "text-rose-500",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      label: "CRITICAL ALERTS",
      value: highSeverityCount.toLocaleString(),
      color: highSeverityCount > 0 ? "text-rose-400" : "text-zinc-500",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
    },
    {
      label: "AI DIAGNOSTICS",
      value: latestIncident ? "Analysing" : "Idle",
      color: latestIncident ? "text-indigo-400" : "text-zinc-600",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="theme-border-subtle grid grid-cols-2 border-b lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="theme-border-subtle theme-card-hover group flex flex-col justify-between border-r p-6 transition-all last:border-r-0"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="theme-text-muted text-[10px] font-black tracking-[0.2em] uppercase">
              {stat.label}
            </span>
            <span className="theme-text-faint group-hover:text-indigo-500/50 transition-colors">
              {stat.icon}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className={`text-3xl font-bold tracking-tight ${stat.color || "theme-text-primary"}`}
            >
              {stat.value}
            </span>
            {stat.label === "ERROR RATE" && (
              <div className="theme-progress-track mt-2 h-1 w-full overflow-hidden rounded-full">
                <div
                  className="h-full bg-rose-500 transition-all duration-1000"
                  style={{ width: errorRate }}
                ></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
