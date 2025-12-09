import React, { useMemo, useState, useEffect } from "react";

export default function ConditionPerProductChart({
  type,
  transactions,
  products,
  conditions,
  title,
  subtitle
}) {
  const availableProducts = useMemo(() => {
    if (products && products.length > 0) {
      return products.map((p) => p.name).filter(Boolean);
    }
    const set = new Set();
    transactions.forEach((tx) => {
      if (tx.type === type && tx.product) {
        set.add(tx.product);
      }
    });
    return Array.from(set);
  }, [products, transactions, type]);

  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    if (!availableProducts.length) {
      setSelectedProduct("");
      return;
    }
    if (!selectedProduct || !availableProducts.includes(selectedProduct)) {
      setSelectedProduct(availableProducts[0]);
    }
  }, [availableProducts, selectedProduct]);

  const data = useMemo(() => {
    if (!selectedProduct) return [];
    const map = {};
    conditions.forEach((c) => {
      map[c] = 0;
    });

    transactions.forEach((tx) => {
      if (tx.type !== type) return;
      if (tx.product !== selectedProduct) return;
      const qty = parseInt(tx.quantity, 10) || 0;
      const key = tx.condition || "";
      if (!key) return;
      map[key] = (map[key] || 0) + qty;
    });

    return conditions.map((c) => ({
      condition: c,
      quantity: map[c] || 0
    }));
  }, [conditions, selectedProduct, transactions, type]);

  const maxQty = useMemo(() => {
    return data.length > 0
      ? Math.max(...data.map((d) => d.quantity))
      : 0;
  }, [data]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-700 text-sm">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500">
            Produk:
          </span>
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
      </div>

      {!selectedProduct || maxQty === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          Belum ada transaksi dengan kondisi untuk produk ini.
        </p>
      ) : (
        <div className="space-y-2">
          {data.map((row) => {
            const widthPercent = maxQty
              ? Math.max(
                  4,
                  Math.round((row.quantity / maxQty) * 100)
                )
              : 0;
            return (
              <div
                key={row.condition}
                className="flex items-center gap-2"
              >
                <div className="w-40 text-[11px] text-gray-600">
                  {row.condition}
                </div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  {row.quantity > 0 && (
                    <div
                      className="h-4 rounded-full bg-teal-500"
                      style={{ width: `${widthPercent}%` }}
                    />
                  )}
                </div>
                <div className="w-10 text-right text-[11px] text-gray-700 font-semibold">
                  {row.quantity}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

