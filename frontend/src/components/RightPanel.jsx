export default function RightPanel() {
    return (
      <aside className="w-80 border-l border-slate-800 hidden xl:block p-4">
        <h3 className="text-white font-bold mb-2">Event Inspector</h3>
  
        <div className="bg-slate-900 p-3 rounded text-xs">
          Select a log to view details
        </div>
      </aside>
    );
  }