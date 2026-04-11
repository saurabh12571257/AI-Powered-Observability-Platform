export default function Header({ searchTerm, onSearchChange, latestIncident, incidentLoading, onAlertClick }) {
  const incidentPending = latestIncident?.status === "pending";
  const incidentCompleted = latestIncident?.status === "completed";
  const buttonLabel = incidentLoading
    ? "Checking incidents..."
    : incidentPending
    ? "High-Severity Incident Pending"
    : incidentCompleted
    ? "Latest Incident Analysis"
    : "No High-Severity Incident";

  return (
    <header className="flex min-h-16 flex-col gap-3 border-b border-slate-800 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-emerald-500">● Live Stream</span>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search logs, services, or levels..."
          className="w-72 rounded border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-indigo-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAlertClick}
          disabled={!latestIncident}
          className={`rounded px-3 py-2 text-xs font-medium transition ${
            latestIncident
              ? "border border-red-400/60 bg-red-500/20 text-red-200 hover:bg-red-500/30"
              : "cursor-not-allowed border border-slate-800 bg-slate-900 text-slate-500"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </header>
  );
}
