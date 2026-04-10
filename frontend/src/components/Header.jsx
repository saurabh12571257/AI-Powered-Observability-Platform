export default function Header({ searchTerm, onSearchChange, alertActive, onAlertClick }) {
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
          className={`rounded px-3 py-2 text-xs font-medium transition ${
            alertActive
              ? "border border-red-400/60 bg-red-500/20 text-red-200 hover:bg-red-500/30"
              : "border border-slate-800 bg-slate-900 text-yellow-300 hover:bg-slate-800"
          }`}
        >
          {alertActive ? "Critical Error Burst" : "Warnings"}
        </button>
      </div>
    </header>
  );
}
