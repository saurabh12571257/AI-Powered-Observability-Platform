function FilterSelect({ label, value, options, onChange, allLabel, ariaLabel }) {
  return (
    <label className="theme-select-shell flex items-center gap-2 rounded-full border px-3 py-2">
      <span className="theme-text-muted text-[10px] font-black uppercase tracking-[0.24em]">
        {label}
      </span>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="theme-text-primary min-w-28 bg-transparent text-[11px] font-semibold outline-none"
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
    <div className="theme-panel-soft theme-border-subtle flex flex-wrap items-center gap-3 border-b px-8 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="theme-text-muted mr-2.5 text-[10px] font-black uppercase tracking-widest">
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
                : "theme-filter-chip"
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
          className="theme-button-surface rounded-full border px-4 py-2 text-[11px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}
