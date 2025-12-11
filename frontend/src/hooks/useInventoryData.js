import { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4400";

function calculateInventory(products, transactions) {
  const inventory = {};
  let totalRevenue = 0;
  let totalProfit = 0;

  products.forEach((p) => {
    inventory[p.name] = {
      name: p.name,
      price: p.price,
      cost: p.cost,
      in: 0,
      out: 0,
      waste: 0,
      quarantine: 0,
      stock: p.stock // TRUST BACKEND STOCK DIRECTLY
    };
  });

  transactions.forEach((tx) => {
    if (!inventory[tx.product]) {
      // If product exists in transaction but not in product list (deleted?), skip stock logic or init 0
      inventory[tx.product] = {
        name: tx.product,
        price: 0,
        cost: 0,
        in: 0,
        out: 0,
        waste: 0,
        quarantine: 0,
        stock: 0
      };
    }
    const qty = parseInt(tx.quantity, 10) || 0;

    if (tx.type === "IN" || tx.type === "MASUK") {
      if (
        [
          "Barang Diterima dari Produksi",
          "Return Barang (masih bisa digunakan)"
        ].includes(tx.condition)
      ) {
        inventory[tx.product].in += qty;
        // inventory[tx.product].stock += qty; // REMOVED: Stock handled by Backend
      } else if (tx.condition === "Retur Barang Rusak Karena Pengiriman") {
        inventory[tx.product].quarantine += qty;
      } else {
        inventory[tx.product].waste += qty;
        // inventory[tx.product].stock -= qty; // REMOVED
      }
    } else if (tx.type === "OUT" || tx.type === "KELUAR") {
      if (
        ["Defects / Cacat Produksi", "Kadaluarsa"].includes(tx.condition)
      ) {
        inventory[tx.product].waste += qty;
        // inventory[tx.product].stock -= qty; // REMOVED
      } else {
        inventory[tx.product].out += qty;
        // inventory[tx.product].stock -= qty; // REMOVED

        if (
          ["SALE", "Reseller", "Consignment (titip jual)"].includes(
            tx.condition
          )
        ) {
          const price = tx.price || inventory[tx.product].price || 0;
          const cost = tx.cost || inventory[tx.product].cost || 0;
          totalRevenue += price * qty;
          totalProfit += (price - cost) * qty;
        }
      }
    }
  });

  return {
    items: Object.values(inventory),
    revenue: totalRevenue,
    profit: totalProfit
  };
}

function calculateSalesByDate(products, transactions) {
  const map = {};

  transactions.forEach((tx) => {
    if (
      (tx.type !== "OUT" && tx.type !== "KELUAR") ||
      !["SALE", "Reseller", "Consignment (titip jual)"].includes(
        tx.condition
      )
    ) {
      return;
    }
    const qty = parseInt(tx.quantity, 10) || 0;
    const price =
      tx.price ||
      products.find((p) => p.name === tx.product)?.price ||
      0;
    const revenue = price * qty;
    const dateKey =
      (tx.date && tx.date.split("T")[0]) ||
      (tx.timestamp &&
        new Date(tx.timestamp).toISOString().split("T")[0]);
    if (!dateKey) return;
    map[dateKey] = (map[dateKey] || 0) + revenue;
  });

  const dates = Object.keys(map).sort();
  const last7 = dates.slice(-7);
  return last7.map((d) => ({ date: d, revenue: map[d] }));
}

export function useInventoryData(token) {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setProducts([]);
        setTransactions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const authHeader = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        };
        const [prodRes, txRes, mutRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/products?limit=1000`, {
            headers: authHeader
          }),
          fetch(`${API_BASE_URL}/api/transaksi?limit=300`, { // OPTIMIZED: Reduced limit
            headers: authHeader
          }),
          fetch(`${API_BASE_URL}/api/mutasi-stok?limit=300`, { // OPTIMIZED: Reduced limit
            headers: authHeader
          })
        ]);

        if (!prodRes.ok) {
          throw new Error("Failed to fetch products");
        }
        if (!txRes.ok) {
          throw new Error("Failed to fetch transactions");
        }
        // Mutation failure is non-critical for now, but good to catch
        if (!mutRes.ok) {
          console.warn("Failed to fetch mutations");
        }

        const productsData = await prodRes.json();
        const transactionsData = await txRes.json();
        const mutationsData = await mutRes.json();

        // Unwrap specific backend response format
        const txList = transactionsData.data || transactionsData;
        const muList = mutationsData.data || mutationsData;

        // Merge transactions (Sales) and Stock Mutations (IN/Adjustments)
        const combinedTransactions = [...txList, ...muList];

        setProducts(productsData.data || productsData);
        setTransactions(combinedTransactions);
      } catch (err) {
        console.error(
          "Error fetching data from Prisma/Supabase API:",
          err
        );
        setError(
          "Gagal memuat data produk dan transaksi dari server. Periksa koneksi atau backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const refreshProducts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data || data);
      }
    } catch (err) {
      console.error("Failed to refresh products", err);
    }
  };

  const [categories, setCategories] = useState([]);

  const refreshCategories = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const categoryList = data.data || data;
        setCategories(categoryList.map((c) => c.name));
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const addCategory = async (name) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        await refreshCategories();
      }
    } catch (e) {
      console.error("Failed to add category", e);
      alert("Gagal menambah kategori ke server.");
    }
  };

  const deleteCategory = async (name) => {
    // We need the ID to delete. But the current UI might only have the name for now if I map it to strings.
    // I should probably store full category objects {id, name} in state, not just strings.
    // For now, let's fetch the list again or find it.
    // A better approach is to change setCategories to store objects.
    // But App.jsx expects strings for the dropdowns currently.
    // I will refactor App.jsx to handle objects later, or just find the ID here.
    // Let's store objects in a separate state or just find it.
    // Actually, I'll just change `categories` to be objects in `useInventoryData` and let App.jsx adapt or mapped.
    // Wait, refactoring App.jsx to handle objects is better.
  };

  const addTransaction = async (data) => {
    const productInfo = products.find((p) => p.name === data.product);
    const costAtTx = productInfo ? productInfo.cost || 0 : 0;
    const priceAtTx = productInfo ? productInfo.price || 0 : 0;

    try {
      const res = await fetch(`${API_BASE_URL}/api/transaksi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: data.date,
          items: [
            {
              type: "ITEM", // REQUIRED by Backend
              qty: data.quantity || 1,
              basePrice: data.basePrice || priceAtTx,
              price: data.price || priceAtTx,
              cost: costAtTx,
              discountPerUnit:
                data.discountPerUnit ??
                (data.basePrice || priceAtTx) -
                (data.price || priceAtTx),
              productId: productInfo ? productInfo.id : null
            }
          ]
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menyimpan transaksi (API Error)");
      }

      // Optimistic Update: Append new data directly
      const resData = await res.json();
      const newItems = resData.data || []; // Array of flattened items
      setTransactions((prev) => [...newItems, ...prev]);

    } catch (e) {
      console.error("Failed to add transaction via Prisma API", e);
      alert(`Gagal menyimpan transaksi: ${e.message}`);
    }
  };

  const deleteTransaction = async (id) => {
    alert(
      "Mode Supabase: hapus transaksi langsung dari database belum diimplementasi."
    );
  };

  const addStockMutation = async (data) => {
    const productInfo = products.find((p) => p.name === data.product);
    if (!productInfo) {
      alert("Produk tidak ditemukan di master Product (Supabase).");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/mutasi-stok`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: productInfo.id,
          type: data.type === "MASUK" ? "IN" : (data.type === "KELUAR" ? "OUT" : data.type), // Handle localized input if any
          condition: data.condition,
          quantity: data.quantity,
          date: data.date,
          reseller: data.reseller,
          productionDate: data.productionDate
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menyimpan mutasi (API Error)");
      }

      // Optimistic Update: Append new data directly
      const resData = await res.json();
      const newItem = resData.data; // Single object

      // StockMutationResource returns localized 'type'. Ensure it matches what frontend list expects.
      setTransactions((prev) => [newItem, ...prev]);

    } catch (e) {
      console.error("Failed to add stock mutation via Prisma API", e);
      alert(`Gagal menyimpan mutasi: ${e.message}`);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      if (!res.ok) {
        throw new Error("Failed to create product");
      }
      await refreshProducts();
    } catch (e) {
      console.error("Failed to add product via Prisma API", e);
      alert("Gagal menambah produk ke Supabase/Prisma API.");
    }
  };

  const handleEditProduct = async (index, updatedProduct) => {
    const target = products[index];
    if (!target?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${target.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      });
      if (!res.ok) {
        throw new Error("Failed to update product");
      }
      await refreshProducts();
    } catch (e) {
      console.error("Failed to edit product via Prisma API", e);
      alert("Gagal mengubah produk di Supabase/Prisma API.");
    }
  };

  const handleDeleteProduct = async (index) => {
    const target = products[index];
    if (!target?.id) return;
    if (!window.confirm("Hapus produk dari database Supabase?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${target.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to delete product");
      }
      await refreshProducts();
    } catch (e) {
      console.error("Failed to delete product via Prisma API", e);
      alert("Gagal menghapus produk di Supabase/Prisma API.");
    }
  };

  const backupData = () => {
    const data = {
      transactions,
      products,
      backupDate: new Date().toISOString()
    };
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `BACKUP_VETPICUREAN_${new Date()
      .toISOString()
      .split("T")[0]}.json`;
    link.click();
  };

  const adjustStock = async (productId, realStock, date, note) => {
    if (!productId) return;
    try {
      // NOTE: use API_BASE_URL to call Laravel backend
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ realStock, date, note })
      });

      if (!res.ok) {
        throw new Error("Failed to adjust stock");
      }

      await refreshProducts(); // Refresh to see updated stock

      const resData = await res.json();
      const mutation = resData.mutation;

      // Update transactions state with the new mutation
      if (mutation) {
        // Flatten or format if necessary to match transaction structure
        // StockMutationResource returns: { id, productId, type, quantity, date, condition, product: {name...} }
        // Frontend expects: { id, product (name), type, quantity, date, condition, ... }

        // We need product name
        const pName = products.find(p => p.id === productId)?.name || "Unknown";

        const newTx = {
          id: mutation.id,
          product: pName,
          type: mutation.type === 'IN' ? 'MASUK' : (mutation.type === 'OUT' ? 'KELUAR' : mutation.type),
          quantity: mutation.quantity,
          date: mutation.date,
          condition: mutation.condition,
          timestamp: new Date().toISOString() // Helper for sorting
        };

        setTransactions(prev => [newTx, ...prev]);
      }

    } catch (e) {
      console.error("Failed to adjust stock", e);
      alert("Gagal melakukan penyesuaian stok.");
    }
  };

  const downloadCSV = () => {
    if (transactions.length === 0)
      return alert("Belum ada data transaksi.");
    const headers = [
      "ID,Tanggal,Tipe,Produk,Jumlah,Kondisi,Harga_Modal,Harga_Jual,Profit_Estimasi,Reseller,Batch_Produksi"
    ];
    const rows = transactions.map((tx) => {
      const safeStr = (str) => `"${(str || "").replace(/"/g, '""')}"`;
      const profit =
        tx.type === "OUT" && tx.condition === "SALE"
          ? (tx.price - tx.cost) * tx.quantity
          : 0;
      return [
        tx.id,
        tx.date,
        tx.type,
        safeStr(tx.product),
        tx.quantity,
        safeStr(tx.condition),
        tx.cost || 0,
        tx.price || 0,
        profit,
        safeStr(tx.reseller),
        tx.productionDate
      ].join(",");
    });
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Laporan_Excel_Vetpicurean_${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    link.click();
  };

  const inventorySummary = useMemo(
    () => calculateInventory(products, transactions),
    [products, transactions]
  );
  const salesByDate = useMemo(
    () => calculateSalesByDate(products, transactions),
    [products, transactions]
  );

  return {
    products,
    transactions,
    inventoryData: inventorySummary.items,
    revenue: inventorySummary.revenue,
    profit: inventorySummary.profit,
    salesByDate,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    addStockMutation,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    backupData,
    downloadCSV,
    categories,
    addCategory,
    deleteCategory,
    refreshCategories,
    adjustStock
  };
}
