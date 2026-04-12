export default function Header({ searchTerm, onSearchChange, latestIncident, incidentLoading, onAlertClick }) {
  const incidentPending = latestIncident?.status === "pending";
  const incidentCompleted = latestIncident?.status === "completed";
  const incidentActive = latestIncident && ["pending", "completed", "failed"].includes(latestIncident.status);

  const buttonLabel = incidentLoading
    ? "Checking incidents..."
    : incidentPending
    ? "High-Severity Incident Pending"
    : incidentCompleted
    ? "Latest Incident Analysis"
    : "No High-Severity Incident";


  return (
    <header className="sticky top-0 z-10 flex min-h-20 items-center justify-between px-8 glass border-x-0 border-t-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">Live Stream</span>
        </div>

        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search logs, services..."
            className="w-80 rounded-xl border border-white/5 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-xs text-zinc-200 outline-none transition-all placeholder:text-zinc-600 focus:border-indigo-500/50 focus:bg-zinc-900 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onAlertClick}
          disabled={incidentLoading}

          className={`group relative flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-xs font-semibold transition-all border ${
            incidentActive
              ? "border-rose-500/30 bg-zinc-900/50 text-rose-500 shadow-lg shadow-rose-500/10 hover:scale-[1.02] active:scale-[0.98] animate-blink-red-fast"
              : "border-emerald-500/30 bg-zinc-900/50 text-emerald-500 animate-blink-green-slow"
          }`}
        >

          {incidentActive && (
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full -translate-x-full"></span>
          )}
          {buttonLabel}
          {incidentActive && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          )}
        </button>

      </div>
    </header>

  );
}
