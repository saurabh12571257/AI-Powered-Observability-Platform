export default function LogRow({ log }) {
    const color =
      log.level === "error"
        ? "text-red-400"
        : log.level === "warn"
        ? "text-yellow-400"
        : "text-green-400";
  
    return (
      <div className="flex gap-4 py-2 px-3 rounded hover:bg-slate-800">
  
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {log.createdAt
            ? new Date(log.createdAt).toLocaleTimeString()
            : "N/A"}
        </span>
  
        <span className={`text-xs font-bold uppercase ${color}`}>
          {log.level}
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