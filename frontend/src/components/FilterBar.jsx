export default function FilterBar() {
    const filters = ["Error", "Warning", "Info"];
  
    return (
      <div className="px-6 py-3 flex gap-2 bg-slate-900/40">
        {filters.map((f) => (
          <button
            key={f}
            className="px-3 py-1 text-xs border rounded bg-slate-800"
          >
            {f}
          </button>
        ))}
      </div>
    );
  }