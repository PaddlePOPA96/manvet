import React, { useState } from "react";
import { Percent, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { formatRupiah } from "../utils/format";

export default function PromotionManager({
  products,
  promotions,
  onAdd,
  onDelete,
  onToggleActive,
  canManage
}) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedProduct, setSelectedProduct] = useState("");
  const [eventPrice, setEventPrice] = useState("");
  const [productPrices, setProductPrices] = useState([]);

  const addProductPrice = (e) => {
    e.preventDefault();
    if (!selectedProduct || !eventPrice) return;
    setProductPrices((prev) => [
      ...prev,
      {
        productName: selectedProduct,
        eventPrice: parseInt(eventPrice, 10)
      }
    ]);
    setSelectedProduct("");
    setEventPrice("");
  };

  const removeProductPrice = (index) => {
    setProductPrices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !startDate || !endDate || productPrices.length === 0) return;
    if (!canManage) {
      alert("Anda tidak memiliki hak untuk mengatur promo.");
      return;
    }
    onAdd({
      name,
      startDate,
      endDate,
      productPrices
    });
    setName("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date().toISOString().split("T")[0]);
    setSelectedProduct("");
    setEventPrice("");
    setProductPrices([]);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <Percent size={22} /> Event Promo Otomatis
        </h2>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nama Event
            </label>
            <input
              className="w-full border p-2 rounded text-sm"
              placeholder="Contoh: Promo Lebaran, Expo, dsb."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              className="w-full border p-2 rounded text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Tanggal Selesai
            </label>
            <input
              type="date"
              className="w-full border p-2 rounded text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <span className="text-xs font-semibold text-gray-600 uppercase">
            Daftar Produk & Harga Event
          </span>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end mt-2">
            <div className="md:col-span-4">
              <label className="block text-xs text-gray-500 mb-1">
                Produk
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
                Harga Event
              </label>
              <input
                type="number"
                className="w-full border p-2 rounded text-sm"
                value={eventPrice}
                onChange={(e) => setEventPrice(e.target.value)}
              />
            </div>
            <div className="md:col-span-1">
              <button
                onClick={addProductPrice}
                className="w-full bg-gray-800 text-white p-2 rounded text-sm flex items-center justify-center gap-1"
              >
                <Plus size={16} /> Tambah
              </button>
            </div>
          </div>

          {productPrices.length > 0 ? (
            <div className="border rounded overflow-hidden mt-3">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase">
                  <tr>
                    <th className="px-3 py-2">Produk</th>
                    <th className="px-3 py-2 text-right">Harga Event</th>
                    <th className="px-3 py-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {productPrices.map((pp, i) => (
                    <tr key={`${pp.productName}-${i}`} className="border-t">
                      <td className="px-3 py-2">{pp.productName}</td>
                      <td className="px-3 py-2 text-right">
                        {formatRupiah(pp.eventPrice)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeProductPrice(i)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-2">
              Belum ada produk ditambahkan ke event.
            </p>
          )}
        </div>

        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={
              !name ||
              !startDate ||
              !endDate ||
              productPrices.length === 0
            }
            className="bg-teal-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Simpan Event
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-2">Event</th>
              <th className="px-4 py-2">Periode</th>
              <th className="px-4 py-2">Produk</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {promotions.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-400 text-sm py-4"
                >
                  Belum ada event promo.
                </td>
              </tr>
            ) : (
              promotions.map((promo) => {
                const active =
                  promo.active ??
                  false;
                const range = `${promo.startDate || "-"} s/d ${
                  promo.endDate || "-"
                }`;
                return (
                  <tr
                    key={promo.id}
                    className="border-b hover:bg-gray-50 align-top"
                  >
                    <td className="px-4 py-2 font-semibold">
                      {promo.name}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-600">
                      {range}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-600">
                      {Array.isArray(promo.productPrices) &&
                      promo.productPrices.length > 0 ? (
                        <ul className="list-disc pl-4 space-y-0.5">
                          {promo.productPrices.map((pp, idx) => (
                            <li key={idx}>
                              {pp.productName} →{" "}
                              {formatRupiah(pp.eventPrice)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          onToggleActive &&
                          onToggleActive(promo.id, !active)
                        }
                        className="inline-flex items-center gap-1 text-xs text-gray-700"
                      >
                        {active ? (
                          <>
                            <ToggleRight
                              size={16}
                              className="text-teal-500"
                            />
                            Aktif
                          </>
                        ) : (
                          <>
                            <ToggleLeft
                              size={16}
                              className="text-gray-400"
                            />
                            Nonaktif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Hapus event "${promo.name}"?`
                            )
                          ) {
                            onDelete(promo.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

