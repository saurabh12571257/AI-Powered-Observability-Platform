export default function Sidebar() {
    return (
      <aside className="w-64 border-r border-slate-800 bg-slate-900/20 flex flex-col">
        
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            ⚡
          </div>
          <span className="text-xl font-bold text-white">LUMINA</span>
        </div>
  
        <nav className="flex-1 px-4 space-y-2">
          <p className="text-xs text-slate-500 uppercase">Environments</p>
  
          {["Production", "Staging", "Development"].map((env) => (
            <button
              key={env}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              {env}
            </button>
          ))}
        </nav>
      </aside>
    );
  }