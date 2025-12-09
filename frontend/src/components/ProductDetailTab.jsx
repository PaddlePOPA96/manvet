import React, { useMemo } from "react";
import { ArrowLeft, Package, TrendingUp, AlertCircle } from "lucide-react";
import { SALE_CONDITIONS } from "../constants/inventory";
import { formatRupiah } from "../utils/format";

export default function ProductDetailTab({
  productName,
  inventoryData,
  transactions,
  onBack
}) {
  const inventory = useMemo(
    () =>
      inventoryData.find((item) => item.name === productName) || {
        name: productName,
        price: 0,
        cost: 0,
        in: 0,
        out: 0,
        waste: 0,
        quarantine: 0,
        stock: 0
      },
    [inventoryData, productName]
  );

  const txForProduct = useMemo(
    () => transactions.filter((tx) => tx.product === productName),
    [transactions, productName]
  );

  const { inByCondition, outByCondition, salesSummary } = useMemo(() => {
    const inMap = {};
    const outMap = {};
    let revenue = 0;
    let profit = 0;
    let soldQty = 0;

    txForProduct.forEach((tx) => {
      const qty = parseInt(tx.quantity, 10) || 0;
      if (tx.type === "IN") {
        inMap[tx.condition] = (inMap[tx.condition] || 0) + qty;
      } else if (tx.type === "OUT") {
        outMap[tx.condition] = (outMap[tx.condition] || 0) + qty;
        if (SALE_CONDITIONS.includes(tx.condition)) {
          const price = tx.price || 0;
          const cost = tx.cost || 0;
          revenue += price * qty;
          profit += (price - cost) * qty;
          soldQty += qty;
        }
      }
    });

    return {
      inByCondition: inMap,
      outByCondition: outMap,
      salesSummary: { revenue, profit, soldQty }
    };
  }, [txForProduct]);

  const inConditions = Object.entries(inByCondition).sort(
    (a, b) => b[1] - a[1]
  );
  const outConditions = Object.entries(outByCondition).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-800 mb-1"
      >
        <ArrowLeft size={14} />
        Kembali ke Stok
      </button>

      <div className="bg-white rounded-lg shadow border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
            <Package size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {productName}
            </h2>
            <p className="text-xs text-gray-500">
              Detail stok & penjualan per kondisi.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div>
            <div className="text-gray-500">Harga Jual</div>
            <div className="font-semibold text-teal-700">
              {formatRupiah(inventory.price || 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Harga Modal</div>
            <div className="font-semibold text-gray-700">
              {formatRupiah(inventory.cost || 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Stok Ready</div>
            <div className="font-semibold text-blue-700">
              {inventory.stock}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Waste</div>
            <div className="font-semibold text-red-600">
              {inventory.waste}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-xs text-gray-500 mb-1">Total Masuk</div>
          <div className="text-2xl font-bold text-emerald-700">
            {inventory.in}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-xs text-gray-500 mb-1">Total Keluar</div>
          <div className="text-2xl font-bold text-red-600">
            {inventory.out}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">
              Ringkasan Penjualan
            </span>
            <TrendingUp size={16} className="text-teal-600" />
          </div>
          <div className="text-xs text-gray-500 mb-1">
            Terjual (SALE/Reseller/Consignment):{" "}
            <span className="font-semibold text-gray-700">
              {salesSummary.soldQty}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Omzet:{" "}
            <span className="font-semibold text-teal-700">
              {formatRupiah(salesSummary.revenue)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Profit:{" "}
            <span className="font-semibold text-emerald-700">
              {formatRupiah(salesSummary.profit)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow border p-4">
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">
            Kondisi Barang Masuk
          </h3>
          {inConditions.length === 0 ? (
            <p className="text-xs text-gray-400">
              Belum ada transaksi barang masuk untuk produk ini pada
              periode yang dipilih.
            </p>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-1">Kondisi</th>
                  <th className="px-3 py-1 text-right">Qty</th>
                </tr>
              </thead>
              <tbody>
                {inConditions.map(([condition, qty]) => (
                  <tr
                    key={condition}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-3 py-1 text-gray-700">
                      {condition}
                    </td>
                    <td className="px-3 py-1 text-right font-semibold">
                      {qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border p-4">
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">
            Kondisi Barang Keluar
          </h3>
          {outConditions.length === 0 ? (
            <p className="text-xs text-gray-400">
              Belum ada transaksi barang keluar untuk produk ini pada
              periode yang dipilih.
            </p>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-1">Kondisi</th>
                  <th className="px-3 py-1 text-right">Qty</th>
                </tr>
              </thead>
              <tbody>
                {outConditions.map(([condition, qty]) => (
                  <tr
                    key={condition}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-3 py-1 text-gray-700">
                      {condition}
                    </td>
                    <td className="px-3 py-1 text-right font-semibold">
                      {qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700 text-sm">
            Riwayat Transaksi Produk
          </h3>
          {txForProduct.length === 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
              <AlertCircle size={12} /> Tidak ada transaksi pada periode
              ini
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-3 py-1">Tanggal</th>
                <th className="px-3 py-1">Tipe</th>
                <th className="px-3 py-1 text-right">Qty</th>
                <th className="px-3 py-1">Kondisi</th>
                <th className="px-3 py-1">Reseller</th>
              </tr>
            </thead>
            <tbody>
              {txForProduct.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-3 py-1">
                    {tx.date}{" "}
                    <span className="text-[10px] text-gray-400">
                      {tx.timestamp
                        ? new Date(tx.timestamp).toLocaleTimeString(
                            "id-ID"
                          )
                        : ""}
                    </span>
                  </td>
                  <td className="px-3 py-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.type === "IN"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.type === "IN" ? "MASUK" : "KELUAR"}
                    </span>
                  </td>
                  <td className="px-3 py-1 text-right font-semibold">
                    {tx.quantity}
                  </td>
                  <td className="px-3 py-1 text-gray-600">
                    {tx.condition}
                  </td>
                  <td className="px-3 py-1 text-gray-400">
                    {tx.reseller || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

