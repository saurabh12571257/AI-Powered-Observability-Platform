export default function LogRow({ log }) {
  const levelStyles = {
    error: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    warn: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const levelColor = levelStyles[log.level?.toLowerCase()] || levelStyles.info;

  const severityStyles =
    log.severity === "high"
      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20 border-transparent"
      : "theme-severity-neutral";

  return (
    <div className="theme-log-row group flex items-center gap-6 rounded-xl border border-transparent px-5 py-3 transition-all">
      <div className="flex w-20 flex-col">
        <span className="theme-text-muted text-[10px] font-medium tabular-nums">
          {log.createdAt
            ? new Date(log.createdAt).toLocaleTimeString([], { hour12: false })
            : "00:00:00"}
        </span>
      </div>

      <div className="flex w-24 items-center">
        <span
          className={`w-full rounded-md border py-1 text-center text-[9px] font-black tracking-widest uppercase ${levelColor}`}
        >
          {log.level}
        </span>
      </div>

      <div className="flex w-20 items-center">
        <span
          className={`rounded-xl border px-3 py-0.5 text-[9px] font-bold uppercase transition-all group-hover:scale-105 ${severityStyles}`}
        >
          {log.severity || "med"}
        </span>
      </div>

      <div className="flex w-32 items-center">
        <span className="text-[10px] font-black tracking-wider text-indigo-500 uppercase">
          {log.service}
        </span>
      </div>

      <div className="flex-1">
        <code className="theme-log-message block flex-1 font-mono text-xs leading-relaxed">
          {log.message}
        </code>
      </div>
    </div>
  );
}
