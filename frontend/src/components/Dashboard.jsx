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
  alertActive,
  analysisPanelOpen,
  aiAnalysis,
  analysisLoading,
  analysisError,
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
          alertActive={alertActive}
          onAlertClick={onAlertClick}
        />
        <StatsBar logs={logs} alertActive={alertActive} />
        <FilterBar activeFilter={activeFilter} onFilterChange={onFilterChange} />
        <div className="flex flex-1 flex-col xl:flex-row">
          <LogsView logs={logs} />
          {analysisPanelOpen && (
            <RightPanel
              alertActive={alertActive}
              analysis={aiAnalysis}
              loading={analysisLoading}
              error={analysisError}
              onClose={onCloseAlert}
            />
          )}
        </div>
      </main>
    </div>
  );
}
