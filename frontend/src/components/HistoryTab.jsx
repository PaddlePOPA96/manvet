import React, { useState, useMemo } from "react";
import { History, Trash2, Filter } from "lucide-react";
import ConditionPerProductChart from "./ConditionPerProductChart";
import ProductConditionChart from "./ProductConditionChart";
import ProductStockTimelineChart from "./ProductStockTimelineChart";
import { CONDITIONS_OUT } from "../constants/inventory";

export default function HistoryTab({
  transactions,
  products,
  conditionChartData,
  conditionChartLimit,
  setConditionChartLimit,
  onDelete
}) {
  const [filterType, setFilterType] = useState("ALL");
  const [filterProduct, setFilterProduct] = useState("ALL");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by type
    if (filterType !== "ALL") {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    // Filter by product
    if (filterProduct !== "ALL") {
      filtered = filtered.filter(tx => tx.product === filterProduct);
    }

    // Filter by date range
    if (filterDateFrom) {
      filtered = filtered.filter(tx => tx.date >= filterDateFrom);
    }
    if (filterDateTo) {
      filtered = filtered.filter(tx => tx.date <= filterDateTo);
    }

    // Sort by timestamp descending (latest first)
    filtered.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    return filtered;
  }, [transactions, filterType, filterProduct, filterDateFrom, filterDateTo]);

  // Get unique product names for filter
  const productNames = useMemo(() => {
    const names = new Set(transactions.map(tx => tx.product));
    return Array.from(names).sort();
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Analisis Penjualan & Pergerakan Stok
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <ConditionPerProductChart
              type="OUT"
              transactions={transactions}
              products={products}
              conditions={CONDITIONS_OUT}
              title="Kondisi Barang Keluar per Produk"
              subtitle="Berdasarkan transaksi OUT (SALE/Reseller/Consignment)"
            />
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <ProductStockTimelineChart
              transactions={transactions}
              products={products}
            />
          </div>
        </div>
        <div className="mt-4 bg-white p-4 rounded-lg border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div>
              <h3 className="font-semibold text-gray-700 text-sm">
                Grafik Kondisi Stok per Produk
              </h3>
              <p className="text-xs text-gray-400">
                Snapshot stok ready, karantina, dan waste per produk.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Tampilkan:</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 bg-white"
                value={conditionChartLimit}
                onChange={(e) =>
                  setConditionChartLimit(
                    Number(e.target.value) || 0
                  )
                }
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
                <option value={0}>Semua produk</option>
              </select>
            </div>
          </div>
          {conditionChartData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              Belum ada data stok untuk ditampilkan.
            </p>
          ) : (
            <ProductConditionChart data={conditionChartData} />
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <History size={20} /> Riwayat Transaksi
          </h2>
          <span className="text-xs text-gray-500">
            Menampilkan: {filteredTransactions.length} / {transactions.length} data
          </span>
        </div>

        {/* Filter Controls */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">Filter</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Tipe
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">Semua</option>
                <option value="IN">Masuk</option>
                <option value="OUT">Keluar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Produk
              </label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
              >
                <option value="ALL">Semua Produk</option>
                {productNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Dari Tanggal
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Sampai Tanggal
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Tipe</th>
                <th className="px-4 py-2">Produk</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Keterangan</th>
                <th className="px-4 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-400"
                  >
                    {transactions.length === 0
                      ? "Belum ada transaksi."
                      : "Tidak ada transaksi yang sesuai dengan filter."}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">
                      {tx.date}{" "}
                      <span className="text-xs text-gray-400">
                        {tx.timestamp
                          ? new Date(tx.timestamp).toLocaleTimeString(
                            "id-ID"
                          )
                          : ""}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${tx.type === "IN"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {tx.type === "IN" ? "MASUK" : "KELUAR"}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {tx.product}
                    </td>
                    <td className="px-4 py-2">{tx.quantity}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">
                      {tx.condition} {tx.reseller && `(${tx.reseller})`}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => onDelete(tx.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

