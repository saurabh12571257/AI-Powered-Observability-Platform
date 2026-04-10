export default function RightPanel({ alertActive, analysis, loading, error, onClose }) {
  if (!alertActive) {
    return null;
  }

  return (
    <aside className="w-full border-t border-slate-800 bg-slate-950/90 p-4 xl:w-96 xl:border-l xl:border-t-0">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-red-300">AI Incident Analysis</p>
          <h3 className="text-lg font-semibold text-white">5 consecutive errors detected</h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
        >
          Close
        </button>
      </div>

      <div className="rounded-xl border border-red-500/20 bg-slate-900 p-4 text-sm text-slate-200">
        {loading && <p>Analyzing the latest error burst with OpenAI...</p>}
        {!loading && error && <p className="text-red-300">{error}</p>}
        {!loading && !error && <p className="whitespace-pre-wrap leading-6">{analysis}</p>}
      </div>
    </aside>
  );
}
