import React, { useState } from "react";
import { Filter, FileText, List, Download, Upload, Edit } from "lucide-react";
import { formatRupiah } from "../utils/format";
import { Card, Button, Badge, SearchInput, Modal, Input } from "./ui";

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
  onSelectProduct,
  adjustStockFn // Function from useInventoryData to call API
}) {
  const [isOpnameModalOpen, setIsOpnameModalOpen] = useState(false);
  const [selectedProductForOpname, setSelectedProductForOpname] = useState(null);
  const [opnameRealStock, setOpnameRealStock] = useState("");
  const [opnameNote, setOpnameNote] = useState("");
  const [processingOpname, setProcessingOpname] = useState(false);

  const openOpnameModal = (product) => {
    setSelectedProductForOpname(product);
    setOpnameRealStock(product.stock); // Default to current stock
    setOpnameNote("");
    setIsOpnameModalOpen(true);
  };

  const closeOpnameModal = () => {
    setIsOpnameModalOpen(false);
    setSelectedProductForOpname(null);
    setProcessingOpname(false);
  };

  const handleOpnameSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductForOpname) return;

    // Find the full product object from the products list to get ID
    // filteredInventory might only have 'name', 'stock', 'price' etc from calculateInventory
    // We need the product ID.
    // Let's assume passed 'products' prop has all info.
    const productFull = products.find(p => p.name === selectedProductForOpname.name);

    if (!productFull) {
      alert("Product data not found");
      return;
    }

    setProcessingOpname(true);
    try {
      await adjustStockFn(
        productFull.id,
        parseInt(opnameRealStock, 10),
        new Date().toISOString(),
        opnameNote
      );
      closeOpnameModal();
    } catch (error) {
      console.error("Opname failed", error);
      // Error handling is inside adjustStockFn typically, but in case:
      setProcessingOpname(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Stok Barang">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant={showLowStockOnly ? "primary" : "secondary"}
              size="sm"
              icon={<Filter size={14} />}
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            >
              {showLowStockOnly ? "Tampilkan Semua" : "Filter Stok Menipis"}
            </Button>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari..."
              className="flex-1 md:flex-none md:w-64"
            />
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
                <th className="px-4 py-2 text-center">Aksi</th>
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
                        <Badge variant="danger">HABIS</Badge>
                      ) : item.stock < 10 ? (
                        <Badge variant="warning">MENIPIS</Badge>
                      ) : (
                        <Badge variant="success">AMAN</Badge>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => openOpnameModal(item)}
                        className="text-gray-500 hover:text-blue-600"
                        title="Edit Stock / Opname"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Helper info and export buttons */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <FileText size={18} /> Data Management
            </div>
          }
        >
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Download size={16} />}
              onClick={backupData}
            >
              Backup JSON
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Download size={16} />}
              onClick={downloadCSV}
            >
              Export CSV
            </Button>
            <label className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-200">
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
          <p className="text-xs text-gray-500 mt-3">
            Backup & restore akan menggunakan database Firebase sebagai
            sumber utama, sehingga data bisa dipakai di banyak device.
          </p>
        </Card>
        <Card
          title={
            <div className="flex items-center gap-2">
              <List size={18} /> Info Singkat
            </div>
          }
        >
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
        </Card>
      </div>

      {/* Stock Opname Modal */}
      <Modal
        isOpen={isOpnameModalOpen}
        onClose={closeOpnameModal}
        title="Stock Opname / Edit Stock"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-4">
          Barang: <strong>{selectedProductForOpname?.name}</strong>
        </p>
        <form onSubmit={handleOpnameSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stok Fisik (Real)
            </label>
            <Input
              type="number"
              required
              min="0"
              value={opnameRealStock}
              onChange={(e) => setOpnameRealStock(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows="2"
              placeholder="Alasan perubahan stok..."
              value={opnameNote}
              onChange={(e) => setOpnameNote(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={closeOpnameModal}
              disabled={processingOpname}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={processingOpname}
            >
              {processingOpname ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
