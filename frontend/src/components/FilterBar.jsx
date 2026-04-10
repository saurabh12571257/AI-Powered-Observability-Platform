export default function FilterBar({ activeFilter, onFilterChange }) {
  const filters = [
    { label: "All", value: "all" },
    { label: "Error", value: "error" },
    { label: "Warning", value: "warn" },
    { label: "Info", value: "info" },
  ];

  return (
    <div className="flex gap-2 bg-slate-900/40 px-6 py-3">
      {filters.map((filter) => (
        <button
          type="button"
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`rounded border px-3 py-1 text-xs transition ${
            activeFilter === filter.value
              ? "border-indigo-500 bg-indigo-500/15 text-indigo-200"
              : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
