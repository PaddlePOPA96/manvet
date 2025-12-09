import React, { useState } from "react";
import { Layers, Plus, Trash2 } from "lucide-react";
import { formatRupiah } from "../utils/format";

export default function PackageManager({
  products,
  packages,
  onAdd,
  onDelete,
  canManage
}) {
  const [name, setName] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [componentQty, setComponentQty] = useState("");
  const [components, setComponents] = useState([]);

  const addComponent = (e) => {
    e.preventDefault();
    if (!selectedProduct || !componentQty || componentQty <= 0) return;
    setComponents((prev) => [
      ...prev,
      {
        productName: selectedProduct,
        quantity: parseInt(componentQty, 10)
      }
    ]);
    setComponentQty("");
  };

  const removeComponent = (index) => {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  };

  const computeCost = () => {
    return components.reduce((sum, c) => {
      const prod = products.find((p) => p.name === c.productName);
      const cost = prod?.cost || 0;
      return sum + cost * c.quantity;
    }, 0);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !salePrice || components.length === 0) return;
    if (!canManage) {
      alert("Anda tidak memiliki hak untuk menambah paket.");
      return;
    }
    const cost = computeCost();
    onAdd({
      name,
      salePrice: parseInt(salePrice, 10),
      cost,
      components
    });
    setName("");
    setSalePrice("");
    setSelectedProduct("");
    setComponentQty("");
    setComponents([]);
  };

  const totalCost = computeCost();

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <Layers size={22} /> Paket Penjualan
        </h2>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nama Paket
            </label>
            <input
              className="w-full border p-2 rounded text-sm"
              placeholder="Contoh: Paket Hemat A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Harga Jual Paket
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded text-sm"
              placeholder="0"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col justify-center text-sm text-gray-700">
            <span className="text-xs text-gray-500 mb-1">
              Estimasi HPP Paket
            </span>
            <span className="font-bold">
              {formatRupiah(totalCost)}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-600 uppercase">
              Komponen Paket
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end mb-3">
            <div className="md:col-span-4">
              <label className="block text-xs text-gray-500 mb-1">
                Pilih Produk
              </label>
              <select
                className="w-full border p-2 rounded text-sm"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">-- Pilih Produk --</option>
                {products.map((p) => (
                  <option key={p.id || p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs text-gray-500 mb-1">
                Qty
              </label>
              <input
                type="number"
                min="1"
                className="w-full border p-2 rounded text-sm"
                value={componentQty}
                onChange={(e) => setComponentQty(e.target.value)}
              />
            </div>
            <div className="md:col-span-1">
              <button
                onClick={addComponent}
                className="w-full bg-gray-800 text-white p-2 rounded text-sm flex items-center justify-center gap-1"
              >
                <Plus size={16} /> Tambah
              </button>
            </div>
          </div>

          {components.length > 0 ? (
            <div className="border rounded overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase">
                  <tr>
                    <th className="px-3 py-2">Produk</th>
                    <th className="px-3 py-2 text-center">Qty</th>
                    <th className="px-3 py-2 text-right">HPP/unit</th>
                    <th className="px-3 py-2 text-right">Subtotal</th>
                    <th className="px-3 py-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((c, idx) => {
                    const prod = products.find(
                      (p) => p.name === c.productName
                    );
                    const cost = prod?.cost || 0;
                    const subtotal = cost * c.quantity;
                    return (
                      <tr
                        key={`${c.productName}-${idx}`}
                        className="border-t"
                      >
                        <td className="px-3 py-2">
                          {c.productName}
                        </td>
                        <td className="px-3 py-2 text-center font-semibold">
                          {c.quantity}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-500">
                          {formatRupiah(cost)}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold">
                          {formatRupiah(subtotal)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeComponent(idx)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              Belum ada komponen. Tambah minimal satu produk ke paket.
            </p>
          )}
        </div>

        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={!name || !salePrice || components.length === 0}
            className="bg-teal-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Simpan Paket
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-2">Nama Paket</th>
              <th className="px-4 py-2 text-right">HPP Paket</th>
              <th className="px-4 py-2 text-right">Harga Jual</th>
              <th className="px-4 py-2">Komponen</th>
              <th className="px-4 py-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-400 text-sm py-4"
                >
                  Belum ada paket tersimpan.
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr
                  key={pkg.id}
                  className="border-b hover:bg-gray-50 align-top"
                >
                  <td className="px-4 py-2 font-semibold">
                    {pkg.name}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-500">
                    {formatRupiah(pkg.cost || 0)}
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-teal-700">
                    {formatRupiah(pkg.salePrice || 0)}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {Array.isArray(pkg.components) &&
                    pkg.components.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-0.5">
                        {pkg.components.map((c, idx) => (
                          <li key={idx}>
                            {c.quantity} x {c.productName}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">
                        -
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Hapus paket "${pkg.name}"?`
                          )
                        ) {
                          onDelete(pkg.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

