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
    <div className="flex min-h-screen bg-[#03060b] text-zinc-300">
      <Sidebar />

      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Global Background Accents */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]"></div>
        <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-rose-500/5 blur-[120px]"></div>

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
        
        <div className="relative flex flex-1 overflow-hidden">
          <LogsView logs={logs} />
          
          {analysisPanelOpen && (
            <RightPanel
              incident={latestIncident}
              onClose={onCloseAlert}
            />
          )}
        </div>
      </main>
    </div>

  );
}
