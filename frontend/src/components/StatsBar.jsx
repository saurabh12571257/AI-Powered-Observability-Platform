export default function StatsBar({ logs, latestIncident }) {
  const totalLogs = logs.length;
  const errorCount = logs.filter((log) => log.level === "error").length;
  const highSeverityCount = logs.filter((log) => log.severity === "high").length;
  const errorRate = totalLogs === 0 ? "0.00%" : `${((errorCount / totalLogs) * 100).toFixed(2)}%`;

  const stats = [
    { label: "Total Logs", value: totalLogs.toLocaleString() },
    { label: "Error Rate", value: errorRate, color: "text-red-400" },
    {
      label: "High Severity",
      value: highSeverityCount.toLocaleString(),
      color: highSeverityCount > 0 ? "text-red-300" : "text-yellow-400",
      cardClassName: highSeverityCount > 0 ? "bg-red-500/10 ring-1 ring-inset ring-red-500/40" : "",
    },
    {
      label: "Latest Incident",
      value: latestIncident ? latestIncident.status : "none",
      color: latestIncident?.status === "completed" ? "text-emerald-300" : "text-slate-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 border-b border-slate-800 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`flex justify-between p-4 ${stat.cardClassName || ""}`}>
          <span className="text-xs text-slate-500">{stat.label}</span>
          <span className={`text-sm ${stat.color || "text-white"}`}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
