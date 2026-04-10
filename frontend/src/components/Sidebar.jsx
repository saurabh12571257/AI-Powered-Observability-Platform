import logsIcon from "../assets/logs.png";

export default function Sidebar() {
  return (
    <aside className="hidden w-20 border-r border-slate-800 bg-slate-900/20 lg:flex lg:flex-col lg:items-center lg:py-6">
      
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg">
        
        <img
          src={logsIcon}
          alt="logs"
          className="h-6 w-6 object-contain"
        />

      </div>

      <span className="mt-12 -rotate-90 text-sm font-bold tracking-[0.4em] text-white">
        LUMINA
      </span>
    </aside>
  );
}