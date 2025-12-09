import React from "react";
import { Search, Filter, FileText, List, Download, Upload } from "lucide-react";
import { formatRupiah } from "../utils/format";

export default function StockTab({
  products,
  filteredInventory,
  searchTerm,
  setSearchTerm,
  showLowStockOnly,
  setShowLowStockOnly,
  backupData,
  downloadCSV,
  fileInputRef,
  handleRestore,
  onSelectProduct
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="font-bold text-gray-700">Stok Barang</h2>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={`flex items-center gap-2 px-3 py-1 rounded border text-sm transition ${
                showLowStockOnly
                  ? "bg-orange-100 border-orange-300 text-orange-800"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter size={14} />{" "}
              {showLowStockOnly
                ? "Tampilkan Semua"
                : "Filter Stok Menipis"}
            </button>
            <div className="relative flex-1 md:flex-none">
              <Search
                className="absolute left-2 top-2 text-gray-400"
                size={16}
              />
              <input
                className="pl-8 pr-4 py-1 border rounded text-sm w-full"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2">Barang</th>
                <th className="px-4 py-2 text-right">Harga Jual</th>
                <th className="px-4 py-2 text-center text-red-500">
                  Waste
                </th>
                <th className="px-4 py-2 text-center bg-blue-50">
                  Stok
                </th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-400"
                  >
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr
                    key={item.name}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 font-medium">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectProduct && onSelectProduct(item.name)
                        }
                        className="text-left text-teal-700 hover:underline"
                      >
                        {item.name}
                      </button>
                    </td>
                    <td className="px-4 py-2 text-right text-teal-700 font-semibold">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="px-4 py-2 text-center text-red-500 font-semibold">
                      {item.waste}
                    </td>
                    <td className="px-4 py-2 text-center font-bold bg-blue-50 text-blue-700">
                      {item.stock}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {item.stock <= 0 ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 font-semibold">
                          HABIS
                        </span>
                      ) : item.stock < 10 ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700 font-semibold">
                          MENIPIS
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-semibold">
                          AMAN
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 flex flex-col gap-3">
          <h2 className="font-bold text-gray-700 flex items-center gap-2">
            <FileText size={18} /> Data Management
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={backupData}
              className="flex items-center gap-2 bg-teal-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-teal-700"
            >
              <Download size={16} /> Backup JSON
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-blue-700"
            >
              <Download size={16} /> Export CSV
            </button>
            <label className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-semibold cursor-pointer hover:bg-gray-200">
              <Upload size={16} />
              Restore JSON
              <input
                type="file"
                ref={fileInputRef}
                accept="application/json"
                className="hidden"
                onChange={handleRestore}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Backup & restore akan menggunakan database Firebase sebagai
            sumber utama, sehingga data bisa dipakai di banyak device.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <h2 className="font-bold text-gray-700 flex items-center gap-2 mb-2">
            <List size={18} /> Info Singkat
          </h2>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>
              • Tab <b>Kasir</b> untuk transaksi penjualan POS.
            </li>
            <li>
              • Tab <b>Masuk</b>/<b>Keluar</b> untuk mutasi stok batch.
            </li>
            <li>
              • Tab <b>Produk</b> untuk master data produk & harga.
            </li>
            <li>
              • Tab <b>Data</b> untuk riwayat semua transaksi.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
