import { useState } from "react";
import logsIcon from "../assets/logs.png";

function ThemeIcon({ theme }) {
  if (theme === "dark") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 3v2.25M12 18.75V21M4.5 12H2.25M21.75 12H19.5M5.636 5.636l1.591 1.591M16.773 16.773l1.591 1.591M18.364 5.636l-1.591 1.591M7.227 16.773l-1.591 1.591M15.75 12A3.75 3.75 0 1112 8.25 3.75 3.75 0 0115.75 12z"
      />
    </svg>
  );
}

export default function Sidebar({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "STREAMS", icon: "󱖒" },
    { label: "ANALYTICS", icon: "󱐋" },
    { label: "ARCHIVE", icon: "󱇬" },
    { label: "SYSTEM", icon: "󰒓" },
  ];

  return (
    <aside
      className={`theme-sidebar hidden lg:flex flex-col border-r backdrop-blur-xl transition-all duration-500 ease-in-out z-30 relative ${
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
          className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
            theme === "dark"
              ? "bg-white text-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              : "bg-slate-950 text-white shadow-[0_0_20px_rgba(15,23,42,0.18)]"
          }`}
        >
          <img
            src={logsIcon}
            alt="logs"
            className={`h-6 w-6 object-contain transition-transform duration-300 ${isOpen ? "scale-110" : "group-hover:scale-110"}`}
          />
          {!isOpen && (
            <div
              className={`absolute left-16 rounded px-2 py-1 text-[10px] font-bold opacity-0 transition-opacity whitespace-nowrap pointer-events-none group-hover:opacity-100 ${
                theme === "dark" ? "bg-white text-black" : "bg-slate-950 text-white"
              }`}
            >
              OPEN NAVIGATION
            </div>
          )}
        </button>

        {/* Brand Label - Positioned directly below logo */}
        {!isOpen && (
          <span
            className={`mt-16 -rotate-90 whitespace-nowrap text-[13px] font-black tracking-[0.4em] uppercase ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
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
              className="theme-nav-item group flex w-full items-center gap-4 rounded-xl px-4 py-3"
            >
              <span className="theme-nav-label text-[10px] font-black tracking-[0.2em]">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-auto w-full px-4 pb-4">
          <button
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={onToggleTheme}
            className={`theme-toggle-surface group relative flex w-full items-center ${
              isOpen ? "justify-between rounded-2xl px-3 py-3" : "justify-center rounded-2xl p-3"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  theme === "dark"
                    ? "bg-white/10 text-amber-300"
                    : "bg-slate-900/10 text-amber-500"
                }`}
              >
                <ThemeIcon theme={theme} />
              </span>

              {isOpen && (
                <div className="flex flex-col items-start">
                  <span className="theme-text-muted text-[10px] font-black tracking-[0.24em] uppercase">
                    Appearance
                  </span>
                  <span className="theme-text-primary text-sm font-semibold">
                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
              )}
            </div>

            {isOpen && (
              <span
                className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
                  theme === "dark" ? "bg-indigo-500/70" : "bg-amber-400/70"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white transition-transform ${
                    theme === "dark" ? "translate-x-5" : "translate-x-0"
                  }`}
                ></span>
              </span>
            )}

            {!isOpen && (
              <div className="pointer-events-none absolute left-16 rounded bg-slate-950 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity whitespace-nowrap group-hover:opacity-100">
                SWITCH TO {theme === "dark" ? "LIGHT" : "DARK"} MODE
              </div>
            )}
          </button>

          {/* Toggle Indicator */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`theme-button-surface mt-3 flex w-full items-center justify-center rounded-xl p-2 transition-all ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
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
      </div>
    </aside>
  );
}
