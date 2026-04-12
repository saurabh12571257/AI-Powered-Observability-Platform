export default function FilterBar({ activeFilter, filterOptions, onFilterChange }) {
  const filters = [
    { label: "All", value: "all" },
    ...filterOptions.map((value) => ({
      label: value,
      value,
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white/[0.02] px-8 py-4 border-b border-white/5">
      <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase mr-2.5">Filter</span>
      {filters.map((filter) => (
        <button
          type="button"
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`relative overflow-hidden rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
            activeFilter === filter.value
              ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              : "bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 border border-white/5"
          }`}
        >
          {filter.label}
          {activeFilter === filter.value && (
             <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20"></span>
          )}
        </button>
      ))}
    </div>

  );
}
