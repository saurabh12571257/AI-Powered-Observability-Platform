export default function LogRow({ log }) {
    const levelColor =
      log.severity === "high"
        ? "text-red-300"
        : log.level === "error"
        ? "text-red-400"
        : log.level === "warn"
        ? "text-yellow-400"
        : "text-emerald-400";

    const severityClasses =
      log.severity === "high"
        ? "border-red-500/40 bg-red-500/10 text-red-200"
        : "border-slate-700 bg-slate-900 text-slate-400";
  
    return (
      <div className="flex gap-4 py-2 px-3 rounded hover:bg-slate-800">
  
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {log.createdAt
            ? new Date(log.createdAt).toLocaleTimeString()
            : "N/A"}
        </span>
  
        <span className={`text-xs font-bold uppercase ${levelColor}`}>
          {log.level}
        </span>

        <span className={`rounded border px-2 py-0.5 text-[10px] font-medium uppercase ${severityClasses}`}>
          {log.severity || "medium"}
        </span>
  
        <span className="text-xs text-indigo-400 uppercase">
          {log.service}
        </span>
  
        <span className="text-sm flex-1 break-all">
          {log.message}
        </span>
      </div>
    );
  }
