import React, { useMemo, useState, useEffect } from "react";

function getDateKey(tx) {
  if (tx.date) return tx.date;
  if (tx.timestamp) {
    try {
      return new Date(tx.timestamp).toISOString().split("T")[0];
    } catch {
      return null;
    }
  }
  return null;
}

export default function ProductStockTimelineChart({
  transactions,
  products
}) {
  const availableProducts = useMemo(() => {
    if (products && products.length > 0) {
      return products.map((p) => p.name).filter(Boolean);
    }
    const set = new Set();
    transactions.forEach((tx) => {
      if (tx.product) set.add(tx.product);
    });
    return Array.from(set);
  }, [products, transactions]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (!availableProducts.length) {
      setSelectedProduct("");
      return;
    }
    if (!selectedProduct || !availableProducts.includes(selectedProduct)) {
      setSelectedProduct(availableProducts[0]);
    }
  }, [availableProducts, selectedProduct]);

  const timelineData = useMemo(() => {
    if (!selectedProduct) return [];

    const txForProduct = transactions
      .filter((tx) => tx.product === selectedProduct)
      .map((tx) => ({
        ...tx,
        _dateKey: getDateKey(tx)
      }))
      .filter((tx) => !!tx._dateKey)
      .sort((a, b) => {
        if (a._dateKey === b._dateKey) return 0;
        return a._dateKey < b._dateKey ? -1 : 1;
      });

    if (txForProduct.length === 0) return [];

    let stock = 0;
    let waste = 0;
    let quarantine = 0;
    const byDate = {};

    txForProduct.forEach((tx) => {
      const qty = parseInt(tx.quantity, 10) || 0;
      const condition = tx.condition || "";
      const type = tx.type;

      if (type === "IN") {
        if (
          [
            "Barang Diterima dari Produksi",
            "Return Barang (masih bisa digunakan)"
          ].includes(condition)
        ) {
          stock += qty;
        } else if (
          condition === "Retur Barang Rusak Karena Pengiriman"
        ) {
          quarantine += qty;
        } else {
          waste += qty;
          stock -= qty;
        }
      } else if (type === "OUT") {
        if (
          ["Defects / Cacat Produksi", "Kadaluarsa"].includes(
            condition
          )
        ) {
          waste += qty;
          stock -= qty;
        } else {
          stock -= qty;
        }
      }

      const dateKey = tx._dateKey;
      byDate[dateKey] = {
        date: dateKey,
        stock: Math.max(0, stock),
        waste: Math.max(0, waste),
        quarantine: Math.max(0, quarantine)
      };
    });

    const dates = Object.keys(byDate).sort();
    const filteredDates = dates.filter((d) => {
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;
      return true;
    });

    return filteredDates.map((d) => byDate[d]);
  }, [transactions, selectedProduct, fromDate, toDate]);

  const maxTotal = useMemo(() => {
    if (!timelineData.length) return 0;
    return Math.max(
      ...timelineData.map(
        (point) =>
          (point.stock || 0) +
          (point.waste || 0) +
          (point.quarantine || 0)
      )
    );
  }, [timelineData]);

  return (
    <div className="space-y-3 border-t pt-4 mt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-700 text-sm">
            Pergerakan Stok per Hari (per Produk)
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Menampilkan stok ready, karantina, dan waste kumulatif per
            tanggal berdasarkan transaksi.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Produk:</span>
            <select
              className="border border-gray-300 rounded text-xs px-2 py-1 bg-white"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {availableProducts.length === 0 ? (
                <option value="">Tidak ada produk</option>
              ) : (
                availableProducts.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Dari:</span>
            <input
              type="date"
              className="border border-gray-300 rounded text-xs px-2 py-1"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Sampai:</span>
            <input
              type="date"
              className="border border-gray-300 rounded text-xs px-2 py-1"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {!selectedProduct || !timelineData.length || !maxTotal ? (
        <p className="text-sm text-gray-400 text-center py-6">
          Belum ada data pergerakan stok untuk produk dan rentang
          tanggal ini.
        </p>
      ) : (
        <>
          <div className="h-48 flex items-end gap-3 overflow-x-auto pb-2">
            {timelineData.map((point) => {
              const total =
                (point.stock || 0) +
                (point.waste || 0) +
                (point.quarantine || 0);
              const heightFactor = maxTotal
                ? total / maxTotal
                : 0;
              const barHeight = 40 + heightFactor * 80;
              const stockPct = total
                ? (point.stock / total) * 100
                : 0;
              const quarantinePct = total
                ? (point.quarantine / total) * 100
                : 0;
              const wastePct = total
                ? (point.waste / total) * 100
                : 0;

              return (
                <div
                  key={point.date}
                  className="flex flex-col items-center justify-end min-w-[48px]"
                >
                  <div className="text-[10px] text-gray-500 mb-1 font-medium">
                    {point.stock}
                  </div>
                  <div
                    className="w-6 bg-gray-100 border border-gray-200 rounded flex flex-col justify-end overflow-hidden"
                    style={{ height: `${barHeight}px` }}
                  >
                    {wastePct > 0 && (
                      <div
                        className="bg-red-500"
                        style={{ height: `${wastePct}%` }}
                        title={`Waste: ${point.waste}`}
                      />
                    )}
                    {quarantinePct > 0 && (
                      <div
                        className="bg-amber-400"
                        style={{ height: `${quarantinePct}%` }}
                        title={`Karantina: ${point.quarantine}`}
                      />
                    )}
                    {stockPct > 0 && (
                      <div
                        className="bg-blue-500"
                        style={{ height: `${stockPct}%` }}
                        title={`Stok Ready: ${point.stock}`}
                      />
                    )}
                  </div>
                  <div className="mt-1 text-[11px] text-gray-500 text-center">
                    {point.date.slice(5)}
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
        </>
      )}
    </div>
  );
}
