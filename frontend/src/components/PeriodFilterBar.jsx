import React from "react";

export default function PeriodFilterBar({
  activeTab,
  periodPreset,
  periodFrom,
  periodTo,
  setPeriodPreset,
  setPeriodFrom,
  setPeriodTo
}) {
  if (!["dashboard", "stock", "history"].includes(activeTab)) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
      <span className="text-sm text-gray-700">Periode:</span>
      <select
        className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
        value={periodPreset}
        onChange={(e) => setPeriodPreset(e.target.value)}
      >
        <option value="7d">7 hari terakhir</option>
        <option value="30d">30 hari terakhir</option>
        <option value="all">Semua</option>
        <option value="custom">Custom</option>
      </select>
      {periodPreset === "custom" && (
        <>
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-1 text-xs"
            value={periodFrom}
            onChange={(e) => setPeriodFrom(e.target.value)}
          />
          <span className="text-xs text-gray-600">s.d.</span>
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-1 text-xs"
            value={periodTo}
            onChange={(e) => setPeriodTo(e.target.value)}
          />
        </>
      )}
    </div>
  );
}
