import React from "react";

export default function NavButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium rounded-lg transition-colors ${
        active
          ? "bg-slate-800 text-white shadow-sm"
          : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-teal-400" : "bg-slate-600"
        }`}
      />
    </button>
  );
}
