import React from "react";
import { formatRupiah } from "../utils/format";

export default function SalesOverviewChart({ data }) {
  const maxRevenue =
    data.length > 0
      ? Math.max(...data.map((d) => d.revenue))
      : 0;

  return (
    <div className="h-48 flex items-end gap-3">
      {data.map((point) => {
        const heightPercent = maxRevenue
          ? Math.max(
              8,
              Math.round((point.revenue / maxRevenue) * 100)
            )
          : 0;
        return (
          <div
            key={point.date}
            className="flex-1 flex flex-col items-center justify-end"
          >
            <div className="text-[10px] text-gray-500 mb-1">
              {formatRupiah(point.revenue)}
            </div>
            <div className="w-full bg-teal-50 border border-teal-100 rounded-md flex items-end justify-center overflow-hidden">
              <div
                className="w-3/4 rounded-md bg-teal-500"
                style={{ height: `${heightPercent}%` }}
              />
            </div>
            <div className="mt-1 text-[11px] text-gray-500 text-center">
              {point.date.slice(5)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

