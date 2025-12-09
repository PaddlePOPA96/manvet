import React, { useState } from "react";
import {
  Settings,
  X,
  Plus,
  CheckCircle,
  Edit2,
  Trash2
} from "lucide-react";
import { formatRupiah } from "../utils/format";
import Input from "./ui/Input";

export default function ProductManager({
  products,
  categories = [],
  units = [],
  onAdd,
  onEdit,
  onDelete,
  canManage
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newProd, setNewProd] = useState({
    name: "",
    price: "",
    cost: "",
    photoUrl: "",
    packageInfo: "",
    category: "",
    unit: ""
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editProd, setEditProd] = useState({
    name: "",
    price: "",
    cost: "",
    photoUrl: "",
    packageInfo: "",
    category: "",
    unit: ""
  });

  const saveNew = (e) => {
    e.preventDefault();
    if (newProd.name && newProd.price) {
      if (!canManage) {
        alert("Anda tidak memiliki hak untuk menambah produk.");
        return;
      }
      onAdd({
        name: newProd.name,
        price: parseInt(newProd.price),
        cost: parseInt(newProd.cost || 0),
        photoUrl: newProd.photoUrl.trim(),
        packageInfo: newProd.packageInfo.trim(),
        category: newProd.category,
        unit: newProd.unit
      });
      setNewProd({
        name: "",
        price: "",
        cost: "",
        photoUrl: "",
        packageInfo: "",
        category: "",
        unit: ""
      });
      setIsAdding(false);
    }
  };

  const saveEdit = () => {
    if (editProd.name && editProd.price) {
      if (!canManage) {
        alert("Anda tidak memiliki hak untuk mengubah produk.");
        return;
      }
      onEdit(editingIndex, {
        name: editProd.name,
        price: parseInt(editProd.price),
        cost: parseInt(editProd.cost || 0),
        photoUrl: (editProd.photoUrl || "").trim(),
        packageInfo: (editProd.packageInfo || "").trim(),
        category: editProd.category,
        unit: editProd.unit
      });
      setEditingIndex(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <Settings size={24} /> Manajemen Produk
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          disabled={!canManage}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}{" "}
          {isAdding ? "Batal" : "Tambah Produk Baru"}
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={saveNew}
          className="bg-teal-50 p-4 rounded-lg mb-6 border border-teal-200 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Nama Produk
            </label>
            <Input
              placeholder="Nama..."
              value={newProd.name}
              onChange={(e) =>
                setNewProd({ ...newProd, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Hrg Modal (HPP)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={newProd.cost}
              onChange={(e) =>
                setNewProd({ ...newProd, cost: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Kategori
            </label>
            <select
              className="w-full border p-2 rounded text-sm disabled:bg-gray-100"
              value={newProd.category || ""}
              onChange={(e) =>
                setNewProd({ ...newProd, category: e.target.value })
              }
            >
              <option value="">- Kategori -</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Satuan
            </label>
            <select
              className="w-full border p-2 rounded text-sm disabled:bg-gray-100"
              value={newProd.unit || ""}
              onChange={(e) =>
                setNewProd({ ...newProd, unit: e.target.value })
              }
            >
              <option value="">- Satuan -</option>
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Hrg Jual
            </label>
            <Input
              type="number"
              placeholder="0"
              value={newProd.price}
              onChange={(e) =>
                setNewProd({ ...newProd, price: e.target.value })
              }
              required
            />
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Info Paket / Deskripsi Singkat
            </label>
            <Input
              placeholder="cth: 1 box isi 10"
              value={newProd.packageInfo}
              onChange={(e) =>
                setNewProd({
                  ...newProd,
                  packageInfo: e.target.value
                })
              }
            />
          </div>
          <button
            type="submit"
            className="bg-teal-600 text-white p-2 rounded font-bold hover:bg-teal-700"
          >
            Simpan
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Produk</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Harga Jual</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr key={p.id || idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 align-top">
                  {editingIndex === idx ? (
                    <div className="space-y-1">
                      <Input
                        className="border px-1 py-1 w-full text-sm"
                        value={editProd.name}
                        onChange={(e) =>
                          setEditProd({
                            ...editProd,
                            name: e.target.value
                          })
                        }
                      />
                      <Input
                        className="border px-1 py-1 w-full text-xs placeholder-gray-400"
                        placeholder="URL Foto"
                        value={editProd.photoUrl || ""}
                        onChange={(e) =>
                          setEditProd({
                            ...editProd,
                            photoUrl: e.target.value
                          })
                        }
                      />
                      <Input
                        className="border px-1 py-1 w-full text-xs placeholder-gray-400"
                        placeholder="Info paket"
                        value={editProd.packageInfo || ""}
                        onChange={(e) =>
                          setEditProd({
                            ...editProd,
                            packageInfo: e.target.value
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {p.photoUrl ? (
                        <img
                          src={p.photoUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                          No foto
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-sm">
                          {p.name}
                        </div>
                        {p.packageInfo && (
                          <div className="text-xs text-gray-500">
                            {p.packageInfo}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-xs text-gray-600">
                  {editingIndex === idx ? (
                    <div className="space-y-1">
                      <select
                        className="w-full border p-1 rounded text-xs"
                        value={editProd.category || ""}
                        onChange={(e) =>
                          setEditProd({ ...editProd, category: e.target.value })
                        }
                      >
                        <option value="">- Kat -</option>
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <select
                        className="w-full border p-1 rounded text-xs"
                        value={editProd.unit || ""}
                        onChange={(e) =>
                          setEditProd({ ...editProd, unit: e.target.value })
                        }
                      >
                        <option value="">- Unit -</option>
                        {units.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <div>{p.category?.name || p.category || "-"}</div>
                      <div className="text-gray-400 text-[10px]">{p.unit || "Pcs"}</div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-bold text-teal-700 align-top">
                  {editingIndex === idx ? (
                    <Input
                      type="number"
                      className="border px-1 py-1 w-full"
                      value={editProd.price}
                      onChange={(e) =>
                        setEditProd({
                          ...editProd,
                          price: e.target.value
                        })
                      }
                    />
                  ) : (
                    formatRupiah(p.price)
                  )}
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  {editingIndex === idx ? (
                    <>
                      <button
                        onClick={saveEdit}
                        disabled={!canManage}
                        className="text-green-600 p-1 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="text-gray-500 p-1"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          if (!canManage) {
                            alert(
                              "Anda tidak memiliki hak untuk mengubah produk."
                            );
                            return;
                          }
                          setEditingIndex(idx);
                          setEditProd({
                            ...p,
                            category: p.category?.name || p.category || ""
                          });
                        }}
                        className="text-blue-500 p-1"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (!canManage) {
                            alert(
                              "Anda tidak memiliki hak untuk menghapus produk."
                            );
                            return;
                          }
                          onDelete(idx);
                        }}
                        className="text-red-500 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
