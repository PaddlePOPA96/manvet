import React from "react";

export default function ProductConditionChart({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  const processed = data
    .map((item) => {
      const stock = item.stock || 0;
      const waste = item.waste || 0;
      const quarantine = item.quarantine || 0;
      const total = stock + waste + quarantine;
      return {
        name: item.name,
        stock,
        waste,
        quarantine,
        total
      };
    })
    .filter((item) => item.total > 0);

  if (processed.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-6">
        Belum ada data stok untuk ditampilkan.
      </p>
    );
  }

  const maxTotal = Math.max(...processed.map((item) => item.total));

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3 overflow-x-auto pb-2">
        {processed.map((item) => {
          const total = item.total || 1;
          const heightFactor = maxTotal ? total / maxTotal : 0;
          const barHeight = 60 + heightFactor * 80;

          const stockPct = (item.stock / total) * 100;
          const quarantinePct = (item.quarantine / total) * 100;
          const wastePct = (item.waste / total) * 100;

          return (
            <div
              key={item.name}
              className="flex flex-col items-center min-w-[80px]"
            >
              <div className="text-[11px] text-gray-600 mb-1 text-center max-w-[90px] truncate">
                {item.name}
              </div>
              <div
                className="w-8 bg-gray-100 border border-gray-200 rounded flex flex-col justify-end overflow-hidden"
                style={{ height: `${barHeight}px` }}
              >
                {wastePct > 0 && (
                  <div
                    className="bg-red-500"
                    style={{ height: `${wastePct}%` }}
                    title={`Waste: ${item.waste}`}
                  />
                )}
                {quarantinePct > 0 && (
                  <div
                    className="bg-amber-400"
                    style={{ height: `${quarantinePct}%` }}
                    title={`Karantina: ${item.quarantine}`}
                  />
                )}
                {stockPct > 0 && (
                  <div
                    className="bg-blue-500"
                    style={{ height: `${stockPct}%` }}
                    title={`Stok Ready: ${item.stock}`}
                  />
                )}
              </div>
              <div className="mt-1 text-[10px] text-gray-500">
                Total: {total}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] text-gray-600">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-blue-500" />
          <span>Stok Ready</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-amber-400" />
          <span>Karantina</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-red-500" />
          <span>Waste / Rusak</span>
        </div>
      </div>
    </div>
  );
}

