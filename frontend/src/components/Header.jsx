export default function Header() {
    return (
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
  
        <div className="flex items-center gap-4">
          <span className="text-emerald-500 text-sm font-medium">
            ● Live Stream
          </span>
  
          <input
            type="text"
            placeholder="Search logs..."
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1 text-xs"
          />
        </div>
  
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-slate-800 rounded text-xs">
            Auto-scroll
          </button>
          <button className="px-3 py-1 bg-indigo-600 rounded text-xs">
            Export
          </button>
        </div>
      </header>
    );
  }