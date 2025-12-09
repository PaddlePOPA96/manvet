import React from "react";

export default function SummaryCard({
  title,
  value,
  color,
  icon,
  isMoney
}) {
  return (
    <div
      className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow bg-white/80 flex flex-col items-start justify-between text-left ${color}`}
    >
      <div className="mb-2 text-slate-600">{icon}</div>
      <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-700">
        {title}
      </span>
      <span
        className={`${
          isMoney ? "text-lg md:text-xl" : "text-2xl"
        } font-bold mt-1`}
      >
        {value}
      </span>
    </div>
  );
}
