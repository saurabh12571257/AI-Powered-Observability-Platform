import { useState, useEffect } from "react";
import AIChat from "./AIChat";

export default function RightPanel({ incident, loading, error, onClose }) {
  const [activeTab, setActiveTab] = useState("analysis");
  const [width, setWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 350 && newWidth < 900) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (!incident) {
      setActiveTab("chat");
    } else {
      setActiveTab("analysis");
    }
  }, [incident]);

  const title = activeTab === "chat"
    ? "Interactive AI Assistant"
    : incident?.status === "pending"
      ? "High-severity incident is being analyzed"
      : incident?.status === "failed"
        ? "Incident analysis failed"
        : "High-severity incident analysis";

  return (
    <aside
      className={`absolute right-0 top-20 bottom-0 z-20 glass shadow-2xl animate-in slide-in-from-right duration-500 ${isResizing ? "transition-none" : "transition-all"}`}
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      <div
        onMouseDown={startResizing}
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize transition-colors hover:bg-indigo-500/20 group z-30"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-zinc-800 group-hover:bg-indigo-500/50 transition-colors"></div>
      </div>

      <div className="flex h-full flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-8 border-b border-white/5">

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${activeTab === "chat" ? "bg-indigo-500" : "bg-rose-500"}`}></span>
              <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${activeTab === "chat" ? "text-indigo-500" : "text-rose-500"}`}>
                {activeTab === "chat" ? "Lumina Chat" : "AI Diagnostic"}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-zinc-900/50 text-zinc-500 transition-all hover:bg-zinc-800 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex border-b border-white/5 bg-zinc-950/20 px-8">

          {incident && (
            <button
              onClick={() => setActiveTab("analysis")}
              className={`py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 mr-6 ${activeTab === "analysis"
                  ? "border-rose-500 text-rose-500"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
            >
              Analysis
            </button>
          )}
          <button
            onClick={() => setActiveTab("chat")}
            className={`py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === "chat"
                ? "border-indigo-500 text-indigo-500"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
          >
            Interactive Chat
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
          {activeTab === "chat" ? (
            <AIChat />
          ) : (
            <div className="flex-1 overflow-y-auto p-8 space-y-8 min-h-0">

              {incident?.triggerLog && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Trigger Event</span>
                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">{incident.triggerLog.service}</span>
                      <span className="text-[10px] font-medium text-rose-500/60 tabular-nums">
                        {new Date(incident.triggerLog.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <code className="text-xs text-rose-200/80 leading-relaxed block">
                      {incident.triggerLog.message}
                    </code>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xs font-bold text-white uppercase">{incident?.status || (loading ? "processing" : "idle")}</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Context</p>
                  <p className="text-xs font-bold text-white uppercase">{incident?.logCount ?? 0} Events</p>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase italic">Neural Analysis</span>
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-transparent to-transparent"></div>
                  <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-6">
                    {loading && (
                      <div className="flex flex-col gap-3">
                        <div className="h-3 w-full animate-pulse rounded bg-white/5"></div>
                        <div className="h-3 w-3/4 animate-pulse rounded bg-white/5"></div>
                        <div className="h-3 w-5/6 animate-pulse rounded bg-white/5"></div>
                      </div>
                    )}
                    {!loading && error && <p className="text-sm text-rose-400">{error}</p>}
                    {!loading && !error && incident?.status === "pending" && (
                      <p className="text-sm leading-relaxed text-zinc-400">
                        Acquiring telemetry samples... Synchronizing incident window logs (T-5s to T+5s).
                      </p>
                    )}
                    {!loading && !error && incident?.status === "completed" && (
                      <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap mono">
                        {incident.analysis}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
