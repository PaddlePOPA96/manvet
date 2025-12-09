import React, { useState } from "react";
import {
  List,
  ShoppingCart,
  Search,
  Minus,
  Plus,
  CheckCircle,
  Printer
} from "lucide-react";
import { formatRupiah } from "../utils/format";

export default function POSSystem({
  products,
  packages,
  promoPriceMap,
  onSubmit,
  onSubmitPackage,
  canCreate
}) {
  const [cart, setCart] = useState([]);
  const [cashInput, setCashInput] = useState("");
  const [search, setSearch] = useState("");
  const [receiptData, setReceiptData] = useState(null);

  const addToCart = (productObj) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.kind === "item" && item.product === productObj.name
      );
      if (existing) {
        return prev.map((item) =>
          item.kind === "item" && item.product === productObj.name
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          kind: "item",
          product: productObj.name,
          qty: 1,
          price: productObj.price,
          basePrice: productObj.price,
          cost: productObj.cost
        }
      ];
    });
  };

  const addPackageToCart = (pkg) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.kind === "package" && item.packageId === pkg.id
      );
      if (existing) {
        return prev.map((item) =>
          item.kind === "package" && item.packageId === pkg.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          kind: "package",
          packageId: pkg.id,
          product: `Paket: ${pkg.name}`,
          qty: 1,
          price: pkg.salePrice,
          basePrice: pkg.salePrice,
          cost: pkg.cost,
          components: pkg.components || []
        }
      ];
    });
  };

  const updateQty = (name, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product === name)
            return { ...item, qty: Math.max(0, item.qty + delta) };
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const applyPromoPrice = (name) => {
    const promo =
      promoPriceMap && promoPriceMap[name]
        ? promoPriceMap[name]
        : null;
    if (!promo) {
      alert("Tidak ada harga promo aktif untuk produk ini.");
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product === name
          ? { ...item, price: promo.eventPrice }
          : item
      )
    );
  };

  const overridePrice = (name) => {
    const target = cart.find((item) => item.product === name);
    if (!target) return;
    const current = target.price || 0;
    const input = window.prompt(
      "Masukkan harga per unit setelah diskon:",
      String(current)
    );
    if (!input) return;
    const newPrice = parseInt(input, 10);
    if (Number.isNaN(newPrice) || newPrice < 0) return;
    setCart((prev) =>
      prev.map((item) =>
        item.product === name ? { ...item, price: newPrice } : item
      )
    );
  };

  const handleCheckout = () => {
    if (!canCreate) {
      alert("Anda tidak memiliki hak untuk membuat transaksi penjualan.");
      return;
    }
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const cash = parseInt(cashInput) || 0;
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (cash < total) return alert("Uang kurang!");

    const today = new Date().toISOString().split("T")[0];
    const timestamp = new Date().toLocaleString("id-ID");
    const txId = "TRX-" + Date.now().toString().slice(-6);

    cart.forEach((item) => {
      if (item.kind === "package") {
        if (onSubmitPackage) {
          onSubmitPackage({
            ...item,
            date: today
          });
        }
      } else {
        onSubmit({
          type: "OUT",
          date: today,
          reseller: "POS Sales",
          product: item.product,
          condition: "SALE",
          quantity: item.qty,
          productionDate: "",
          price: item.price,
          basePrice: item.basePrice,
          discountPerUnit:
            (item.basePrice || item.price) - (item.price || 0)
        });
      }
    });

    setReceiptData({
      id: txId,
      date: timestamp,
      items: cart,
      total: total,
      cash: cash,
      change: cash - total
    });
    setCart([]);
    setCashInput("");
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const change = (parseInt(cashInput) || 0) - totalAmount;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-140px)]">
      {receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
            <div className="text-center mb-4">
              <div className="text-green-600 mb-2 flex justify-center">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Transaksi Berhasil!
              </h3>
              <p className="text-gray-500 text-sm">
                Kembalian:{" "}
                <span className="font-bold text-gray-800">
                  {formatRupiah(receiptData.change)}
                </span>
              </p>
            </div>
            <div
              id="printable-receipt"
              className="bg-white p-2 text-sm font-mono border border-gray-200 mb-4 rounded"
            >
              <div className="text-center border-b border-dashed pb-2 mb-2">
                <h2 className="font-bold text-lg">
                  {localStorage.getItem("vet_store_settings")
                    ? JSON.parse(localStorage.getItem("vet_store_settings"))
                      .storeName
                    : "VETPICUREAN"}
                </h2>
                <p className="text-xs">
                  {localStorage.getItem("vet_store_settings")
                    ? JSON.parse(localStorage.getItem("vet_store_settings"))
                      .storeAddress
                    : "Pet Food & Supplies"}
                </p>
                <p className="text-xs text-gray-500">
                  {receiptData.date}
                </p>
                <p className="text-xs text-gray-500">
                  #{receiptData.id}
                </p>
              </div>
              <div className="space-y-1 mb-2 border-b border-dashed pb-2">
                {receiptData.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between"
                  >
                    <span>
                      {item.product} x{item.qty}
                    </span>
                    <span>{formatRupiah(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>{formatRupiah(receiptData.total)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>TUNAI</span>
                <span>{formatRupiah(receiptData.cash)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>KEMBALI</span>
                <span>{formatRupiah(receiptData.change)}</span>
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-2">
                {localStorage.getItem("vet_store_settings")
                  ? JSON.parse(localStorage.getItem("vet_store_settings"))
                    .footerMessage
                  : "Terima kasih sudah berbelanja di Vetpicurean."}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Printer size={16} /> Cetak
              </button>
              <button
                onClick={() => setReceiptData(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 bg-white rounded-lg shadow border p-4 flex flex-col">
        <div className="flex justify-between items-center mb-3 gap-2">
          <h2 className="font-bold text-gray-700 flex items-center gap-2">
            <ShoppingCart size={20} /> POS Kasir
          </h2>
          <div className="relative w-56">
            <Search
              className="absolute left-2 top-2 text-gray-400"
              size={16}
            />
            <input
              className="pl-8 pr-3 py-1 border rounded text-sm w-full"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {packages && packages.length > 0 && (
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-gray-600 mb-1">
              Paket Penjualan
            </h3>
            <div className="flex flex-wrap gap-2">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => addPackageToCart(pkg)}
                  className="border rounded-full px-3 py-1 text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-2"
                >
                  <span>{pkg.name}</span>
                  <span className="font-semibold">
                    {formatRupiah(pkg.salePrice || 0)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto">
          {filteredProducts.map((p) => {
            const promo =
              promoPriceMap && promoPriceMap[p.name]
                ? promoPriceMap[p.name]
                : null;
            const effectivePrice = promo
              ? promo.eventPrice
              : p.price;
            return (
              <button
                key={p.id || p.name}
                onClick={() => addToCart(p)}
                className="border rounded-lg p-2 hover:bg-teal-50 text-left flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-1">
                  {p.photoUrl && (
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="w-8 h-8 rounded object-cover border border-gray-200"
                    />
                  )}
                  <div>
                    <div className="text-xs text-gray-700 font-medium">
                      {p.name}
                    </div>
                    {p.packageInfo && (
                      <div className="text-[10px] text-gray-500">
                        {p.packageInfo}
                      </div>
                    )}
                    {promo && (
                      <div className="text-[10px] text-red-500">
                        {promo.promotionName}: {formatRupiah(effectivePrice)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm font-bold text-teal-700">
                  {promo ? (
                    <>
                      <span className="line-through text-gray-400 mr-1 text-xs">
                        {formatRupiah(p.price)}
                      </span>
                      <span>{formatRupiah(effectivePrice)}</span>
                    </>
                  ) : (
                    <span>{formatRupiah(p.price)}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full md:w-80 bg-white rounded-lg shadow border p-4 flex flex-col">
        <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-3">
          <List size={18} /> Keranjang
        </h3>
        <div className="flex-1 overflow-y-auto border rounded mb-3">
          {cart.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">
              Belum ada item.
            </p>
          ) : (
            <ul className="divide-y">
              {cart.map((item) => (
                <li
                  key={item.product}
                  className="px-3 py-2 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.product}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.qty} x {formatRupiah(item.price)}
                    </p>
                    {item.basePrice &&
                      item.price !== item.basePrice && (
                        <p className="text-[10px] text-red-500">
                          Diskon dari{" "}
                          {formatRupiah(item.basePrice)} per unit
                        </p>
                      )}
                    <div className="mt-1 flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => overridePrice(item.product)}
                        className="px-2 py-0.5 border rounded text-[10px] text-teal-700 hover:bg-teal-50"
                      >
                        Diskon / Ubah harga
                      </button>
                      <button
                        type="button"
                        disabled={
                          !promoPriceMap || !promoPriceMap[item.product]
                        }
                        onClick={() => applyPromoPrice(item.product)}
                        className="px-2 py-0.5 border rounded text-[10px] text-indigo-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Harga promo
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.product, -1)}
                      className="p-1 rounded-full border text-gray-600 hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.product, 1)}
                      className="p-1 rounded-full border text-gray-600 hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-2 border-t pt-2">
          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span className="font-bold">
              {formatRupiah(totalAmount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Tunai</span>
            <input
              type="number"
              className="flex-1 border rounded px-2 py-1 text-sm"
              value={cashInput}
              onChange={(e) => setCashInput(e.target.value)}
              placeholder="Jumlah uang"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Kembalian</span>
            <span className="font-bold text-orange-500">
              {change >= 0 ? formatRupiah(change) : "-"}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 mb-2">
            {[50000, 100000].map((amt) => (
              <button
                key={amt}
                onClick={() => setCashInput(amt.toString())}
                className="col-span-2 bg-teal-50 text-teal-700 text-xs py-1 rounded border border-teal-100 hover:bg-teal-100 font-bold"
              >
                {amt / 1000}k
              </button>
            ))}
          </div>
          <button
            onClick={handleCheckout}
            disabled={!canCreate}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold shadow hover:bg-gray-900 transition flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Printer size={18} /> Bayar &amp; Cetak
          </button>
        </div>
      </div>
    </div>
  );
}
