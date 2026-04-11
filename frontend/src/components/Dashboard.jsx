import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsBar from "../components/StatsBar";
import FilterBar from "../components/FilterBar";
import LogsView from "../components/LogsView";
import RightPanel from "../components/RightPanel";

export default function Dashboard({
  logs,
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  filterOptions,
  latestIncident,
  incidentLoading,
  incidentError,
  analysisPanelOpen,
  onAlertClick,
  onCloseAlert,
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-300">
      <Sidebar />

      <main className="flex min-h-screen flex-1 flex-col">
        <Header
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          latestIncident={latestIncident}
          incidentLoading={incidentLoading}
          onAlertClick={onAlertClick}
        />
        <StatsBar logs={logs} latestIncident={latestIncident} />
        <FilterBar
          activeFilter={activeFilter}
          filterOptions={filterOptions}
          onFilterChange={onFilterChange}
        />
        <div className="flex flex-1 flex-col xl:flex-row">
          <LogsView logs={logs} />
          {analysisPanelOpen && (
            <RightPanel
              incident={latestIncident}
              loading={incidentLoading}
              error={incidentError}
              onClose={onCloseAlert}
            />
          )}
        </div>
      </main>
    </div>
  );
}
