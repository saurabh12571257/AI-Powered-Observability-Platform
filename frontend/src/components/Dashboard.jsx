import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsBar from "../components/StatsBar";
import FilterBar from "../components/FilterBar";
import LogsView from "../components/LogsView";
import RightPanel from "../components/RightPanel";

export default function Dashboard({
  theme,
  onToggleTheme,
  logs,
  allLogs,
  searchTerm,
  onSearchChange,
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
  latestIncident,
  incidentLoading,
  incidentError,
  analysisPanelOpen,
  onAlertClick,
  onCloseAlert,
}) {
  return (
    <div className="theme-shell flex min-h-screen">
      <Sidebar theme={theme} onToggleTheme={onToggleTheme} />

      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Global Background Accents */}
        <div
          className={`pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full blur-[120px] ${
            theme === "dark" ? "bg-indigo-500/10" : "bg-sky-400/20"
          }`}
        ></div>
        <div
          className={`pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full blur-[120px] ${
            theme === "dark" ? "bg-rose-500/5" : "bg-amber-300/25"
          }`}
        ></div>

        <Header
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          latestIncident={latestIncident}
          incidentLoading={incidentLoading}
          onAlertClick={onAlertClick}
        />

        <StatsBar logs={allLogs || logs} latestIncident={latestIncident} />

        <FilterBar
          activeLevelFilter={activeLevelFilter}
          onLevelFilterChange={onLevelFilterChange}
          levelOptions={levelOptions}
          activeServiceFilter={activeServiceFilter}
          onServiceFilterChange={onServiceFilterChange}
          serviceOptions={serviceOptions}
          activeSeverityFilter={activeSeverityFilter}
          onSeverityFilterChange={onSeverityFilterChange}
          severityOptions={severityOptions}
          visibleLogCount={visibleLogCount}
          totalLogCount={totalLogCount}
          hasActiveFilters={hasActiveFilters}
          onResetView={onResetView}
        />

        {analysisPanelOpen && (
          <RightPanel
            incident={latestIncident}
            loading={incidentLoading}
            error={incidentError}
            onClose={onCloseAlert}
          />
        )}

        <div className="relative flex flex-1 overflow-hidden">
          <LogsView logs={logs} />
        </div>
      </main>
    </div>
  );
}
