import LogRow from "./LogRow";

export default function LogsView({ logs }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      {logs.map((log, i) => (
        <LogRow key={i} log={log} />
      ))}
    </div>
  );
}
