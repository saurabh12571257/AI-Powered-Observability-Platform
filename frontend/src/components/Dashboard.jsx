import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsBar from "../components/StatsBar";
import FilterBar from "../components/FilterBar";
import LogsView from "../components/LogsView";
import RightPanel from "../components/RightPanel";

export default function Dashboard({ logs }) {
    return (
      <div className="flex h-screen bg-slate-950 text-slate-300">
        <Sidebar />
  
        <main className="flex-1 flex flex-col">
          <Header />
          <StatsBar logs={logs} />
          <FilterBar />
          <LogsView logs={logs} />  {}
        </main>
  
        <RightPanel />
      </div>
    );
  }