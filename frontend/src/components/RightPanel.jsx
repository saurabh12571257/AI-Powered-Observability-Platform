export default function RightPanel({ incident, loading, error, onClose }) {
  if (!incident && !loading && !error) {
    return null;
  }

  const title = incident?.status === "pending"
    ? "High-severity incident is being analyzed"
    : incident?.status === "failed"
    ? "Incident analysis failed"
    : "High-severity incident analysis";

  return (
    <aside className="w-full border-t border-slate-800 bg-slate-950/90 p-4 xl:w-96 xl:border-l xl:border-t-0">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-red-300">AI Incident Analysis</p>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {incident?.triggerLog && (
            <p className="mt-1 text-xs text-slate-400">
              Trigger: {incident.triggerLog.service} [{incident.triggerLog.level}] severity=
              {incident.triggerLog.severity}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
        >
          Close
        </button>
      </div>

      <div className="mb-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-slate-400">
        <p>Status: <span className="text-slate-200">{incident?.status || (loading ? "loading" : "unknown")}</span></p>
        <p>Window: <span className="text-slate-200">5s before to 5s after trigger</span></p>
        <p>Log count: <span className="text-slate-200">{incident?.logCount ?? 0}</span></p>
      </div>

      <div className="rounded-xl border border-red-500/20 bg-slate-900 p-4 text-sm text-slate-200">
        {loading && <p>Loading the latest incident...</p>}
        {!loading && error && <p className="text-red-300">{error}</p>}
        {!loading && !error && incident?.status === "pending" && (
          <p className="leading-6">
            The backend has opened an incident window and is waiting for the 5-second post-trigger context to finish before sending the full timeline to AI.
          </p>
        )}
        {!loading && !error && incident?.status === "failed" && (
          <p className="whitespace-pre-wrap leading-6 text-red-300">
            {incident.error || "The AI analysis failed."}
          </p>
        )}
        {!loading && !error && incident?.status === "completed" && (
          <p className="whitespace-pre-wrap leading-6">
            {incident.analysis}
          </p>
        )}
      </div>
    </aside>
  );
}
