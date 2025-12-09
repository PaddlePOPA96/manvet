import React, { useState } from "react";
import { User, Lock, Save, Mail, Shield } from "lucide-react";
import Input from "./ui/Input";
import { useAuth } from "../hooks/useAuth";

export default function ProfileTab() {
  const { currentUser, userRole } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Password baru tidak cocok" });
      return;
    }

    setLoading(true);
    // Simulasi request ke backend
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: "success", text: "Password berhasil diperbarui" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User size={20} className="text-teal-600" /> Profil Saya
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info Profil */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Informasi Akun
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 text-2xl font-bold">
                {currentUser?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Shield size={12} /> Role
                </div>
                <div className="font-semibold text-gray-800 uppercase text-sm mb-2">
                  {userRole}
                </div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Mail size={12} /> Email
                </div>
                <div className="font-medium text-gray-800">
                  {currentUser?.email || "user@example.com"}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              * Hubungi Superadmin jika ingin mengubah email atau role akses Anda.
            </div>
          </div>

          {/* Ganti Password */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lock size={16} /> Ganti Password
            </h3>

            {message.text && (
              <div
                className={`p-3 rounded text-sm ${
                  message.type === "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password Lama
                </label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password Baru
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Konfirmasi Password Baru
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-teal-700 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    "Memproses..."
                  ) : (
                    <>
                      <Save size={16} /> Simpan Password Baru
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
