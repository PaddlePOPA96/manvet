import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const TAB_OPTIONS = [
  { id: "dashboard", label: "Ringkasan" },
  { id: "stock", label: "Stok" },
  { id: "products", label: "Produk" },
  { id: "pos", label: "Penjualan / POS" },
  { id: "in", label: "Pembelian / Barang Masuk" },
  { id: "out", label: "Barang Keluar" },
  { id: "history", label: "Laporan Transaksi" },
  { id: "master", label: "Master Data" },
  { id: "settings", label: "Pengaturan Toko" }
];

export default function UserAccessManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const list = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() || {};
          list.push({
            id: docSnap.id,
            email: data.email || "(tanpa email)",
            role: data.role || "user",
            allowedTabs: Array.isArray(data.allowedTabs)
              ? data.allowedTabs
              : []
          });
        });
        setUsers(list);
      } catch (e) {
        console.error("Failed to load users for access manager", e);
        setError("Gagal memuat data pengguna dari Firebase.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updateUserTabs = async (userId, newTabs) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, allowedTabs: newTabs } : u
      )
    );

    if (!db) return;

    try {
      const ref = doc(db, "users", userId);
      await updateDoc(ref, { allowedTabs: newTabs });
    } catch (e) {
      console.error("Failed to update allowedTabs", e);
      setError("Gagal menyimpan pengaturan akses. Coba lagi.");
    }
  };

  const toggleTab = (user, tabId) => {
    const hasTab = user.allowedTabs.includes(tabId);
    const updated = hasTab
      ? user.allowedTabs.filter((t) => t !== tabId)
      : [...user.allowedTabs, tabId];
    updateUserTabs(user.id, updated);
  };

  const setAllTabs = (user, all) => {
    updateUserTabs(user.id, all ? TAB_OPTIONS.map((t) => t.id) : []);
  };

  if (!db) {
    return (
      <div className="bg-white rounded-lg shadow border p-4">
        <h2 className="font-bold text-gray-700 mb-2">
          Pengaturan Akses User
        </h2>
        <p className="text-sm text-gray-500">
          Fitur ini memerlukan konfigurasi Firebase (koleksi{" "}
          <span className="font-mono">users</span>). Saat ini aplikasi
          berjalan dalam mode tanpa Firebase, sehingga pengaturan akses
          tidak dapat diubah.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border p-4">
        <p className="text-sm text-gray-500">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-700">
          Pengaturan Akses User
        </h2>
        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
      </div>
      {users.length === 0 ? (
        <p className="text-sm text-gray-500">
          Belum ada data user pada koleksi <span className="font-mono">users</span>.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Akses Halaman</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2 text-xs uppercase text-gray-500">
                    {String(user.role || "user").toUpperCase()}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      {TAB_OPTIONS.map((tab) => (
                        <label
                          key={tab.id}
                          className="flex items-center gap-1 text-[11px] text-gray-600"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={user.allowedTabs.includes(tab.id)}
                            onChange={() => toggleTab(user, tab.id)}
                          />
                          <span>{tab.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setAllTabs(user, true)}
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllTabs(user, false)}
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Nonaktifkan semua
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
