import { useState } from "react";
import logsIcon from "../assets/logs.png";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "STREAMS", icon: "󱖒" },
    { label: "ANALYTICS", icon: "󱐋" },
    { label: "ARCHIVE", icon: "󱇬" },
    { label: "SYSTEM", icon: "󰒓" },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-white/5 bg-zinc-950/40 backdrop-blur-xl transition-all duration-500 ease-in-out z-30 relative ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Neural Pulse Spark */}
      {isOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-px overflow-hidden pointer-events-none">
          <div className="spark-tracer" />
        </div>
      )}

      <div className="flex flex-col items-center py-8 h-full relative z-10">
        {/* Log Icon Button - Always White */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300"
        >
          <img
            src={logsIcon}
            alt="logs"
            className={`h-6 w-6 object-contain transition-transform duration-300 ${isOpen ? "scale-110" : "group-hover:scale-110"}`}
          />
          {!isOpen && (
            <div className="absolute left-16 px-2 py-1 rounded bg-white text-black text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              OPEN NAVIGATION
            </div>
          )}
        </button>

        {/* Brand Label - Positioned directly below logo */}
        {!isOpen && (
          <span className="mt-16 -rotate-90 text-[13px] font-black tracking-[0.4em] text-white uppercase whitespace-nowrap">
            LUMINA
          </span>
        )}

        {/* Menu Items */}
        <div
          className={`mt-12 w-full px-4 space-y-2 transition-all duration-300 ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`}
        >
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="w-full group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
            >
              <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Toggle Indicator */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`mt-auto mb-4 p-2 text-zinc-600 hover:text-white transition-colors ${isOpen ? "rotate-0" : "rotate-180"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}
