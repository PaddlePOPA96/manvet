import React, { useState, useEffect } from "react";
import { Plus, Save, X } from "lucide-react";
import Input from "./ui/Input";
import Select from "./ui/Select";

export default function BatchTransactionForm({
  type,
  title,
  products,
  conditions,
  onSubmit,
  bgColor,
  btnColor,
  canCreate
}) {
  const [header, setHeader] = useState({
    date: new Date().toISOString().split("T")[0],
    reseller: ""
  });
  const [item, setItem] = useState({
    product: "",
    condition: conditions[0],
    quantity: "",
    productionDate: ""
  });
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (products.length > 0 && !item.product) {
      setItem((prev) => ({ ...prev, product: products[0].name }));
    }
  }, [products]);

  const add = (e) => {
    e.preventDefault();
    if (!item.quantity || item.quantity <= 0)
      return alert("Jumlah > 0");
    if (!item.product) return alert("Pilih produk");
    setCart([...cart, { ...item, id: Date.now() }]);
    setItem((prev) => ({ ...prev, quantity: "" }));
  };

  const saveAll = () => {
    if (!cart.length) return;
    if (
      window.confirm(`Simpan ${cart.length} item ke database?`)
    ) {
      if (!canCreate) {
        alert("Anda tidak memiliki hak untuk membuat transaksi.");
        return;
      }
      cart.forEach((c) => {
        onSubmit({
          type,
          date: header.date,
          reseller: header.reseller,
          product: c.product,
          condition: c.condition,
          quantity: c.quantity,
          productionDate: c.productionDate
        });
      });
      setCart([]);
      alert("Tersimpan ke database.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden max-w-5xl mx-auto">
      <div className={`p-4 border-b ${bgColor}`}>
        <h2 className="font-bold text-lg flex items-center gap-2">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Input
            type="date"
            value={header.date}
            onChange={(e) =>
              setHeader({ ...header, date: e.target.value })
            }
          />
          {type === "OUT" && (
            <Input
              className="placeholder-gray-400"
              placeholder="Nama Reseller (Opsional)"
              value={header.reseller}
              onChange={(e) =>
                setHeader({ ...header, reseller: e.target.value })
              }
            />
          )}
        </div>
      </div>
      <div className="p-4 bg-white border-b">
        <form
          onSubmit={add}
          className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end"
        >
          <div className="md:col-span-3">
            <label className="text-xs text-gray-500 block mb-1">
              Produk
            </label>
            <Select
              value={item.product}
              onChange={(e) =>
                setItem({ ...item, product: e.target.value })
              }
            >
              {products.map((p, i) => (
                <option key={p.id || i} value={p.name}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-gray-500 block mb-1">
              Kondisi
            </label>
            <Select
              value={item.condition}
              onChange={(e) =>
                setItem({ ...item, condition: e.target.value })
              }
            >
              {conditions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-gray-500 block mb-1">
              Batch / Tgl
            </label>
            <Input
              type="date"
              className="placeholder-gray-400"
              value={item.productionDate}
              onChange={(e) =>
                setItem({
                  ...item,
                  productionDate: e.target.value
                })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 block mb-1">
              Jumlah
            </label>
            <Input
              type="number"
              min="1"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) =>
                setItem({ ...item, quantity: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-900"
            >
              <Plus size={18} />
            </button>
          </div>
        </form>
      </div>
      <div className="p-4">
        {cart.length > 0 ? (
          <div className="border rounded overflow-hidden mb-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Kondisi</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2 text-right">Hapus</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((c, i) => (
                  <tr
                    key={c.id || i}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{c.product}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">
                      {c.condition}
                    </td>
                    <td className="px-4 py-2 font-bold">
                      {c.quantity}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() =>
                          setCart(
                            cart.filter((_, idx) => idx !== i)
                          )
                        }
                        className="text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-4 text-sm">
            Belum ada item ditambahkan.
          </p>
        )}
        <button
          onClick={saveAll}
          disabled={cart.length === 0}
          className={`w-full py-3 text-white font-bold rounded shadow flex justify-center items-center gap-2 ${
            cart.length === 0 ? "bg-gray-300" : btnColor
          }`}
        >
          <Save size={18} /> Simpan Semua
        </button>
      </div>
    </div>
  );
}
