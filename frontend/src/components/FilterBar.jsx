function FilterSelect({ label, value, options, onChange, allLabel, ariaLabel }) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-white/5 bg-zinc-950/40 px-3 py-2">
      <span className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-600">
        {label}
      </span>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-28 bg-transparent text-[11px] font-semibold text-zinc-200 outline-none"
      >
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function FilterBar({
  activeLevelFilter,
  onLevelFilterChange,
  levelOptions,
  activeServiceFilter,
  onServiceFilterChange,
  serviceOptions,
  activeSeverityFilter,
  onSeverityFilterChange,
  severityOptions,
  visibleLogCount,
  totalLogCount,
  hasActiveFilters,
  onResetView,
}) {
  const filters = [
    { label: "All", value: "all" },
    ...levelOptions,
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-white/5 bg-white/[0.02] px-8 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-600">
          Level
        </span>
        {filters.map((filter) => (
          <button
            type="button"
            key={filter.value}
            onClick={() => onLevelFilterChange(filter.value)}
            className={`relative overflow-hidden rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
              activeLevelFilter === filter.value
                ? "border-indigo-500 bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                : "border-white/5 bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            }`}
          >
            {filter.label}
            {activeLevelFilter === filter.value && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20"></span>
            )}
          </button>
        ))}
      </div>

      <FilterSelect
        label="Service"
        value={activeServiceFilter}
        options={serviceOptions}
        onChange={onServiceFilterChange}
        allLabel="All services"
        ariaLabel="Service filter"
      />

      <FilterSelect
        label="Severity"
        value={activeSeverityFilter}
        options={severityOptions}
        onChange={onSeverityFilterChange}
        allLabel="All severities"
        ariaLabel="Severity filter"
      />

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-emerald-500/10 bg-emerald-500/5 px-4 py-2">
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-400/70">
            Visible Streams
          </span>
          <div className="mt-1 text-sm font-semibold text-emerald-200">
            {visibleLogCount.toLocaleString()} / {totalLogCount.toLocaleString()}
          </div>
        </div>

        <button
          type="button"
          onClick={onResetView}
          disabled={!hasActiveFilters}
          className="rounded-full border border-white/5 bg-zinc-950/40 px-4 py-2 text-[11px] font-semibold text-zinc-300 transition-all hover:border-white/10 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:text-zinc-600"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
