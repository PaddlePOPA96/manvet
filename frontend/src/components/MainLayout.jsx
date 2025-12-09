import React from "react";
import {
  Package,
  ArrowUpCircle,
  ArrowDownCircle,
  LayoutDashboard,
  Settings,
  FileText,
  List,
  ShoppingCart,
  TrendingUp,
  Home,
  User,
  Database,
  Store
} from "lucide-react";
import NavButton from "./NavButton";

const TAB_TITLES = {
  dashboard: "Ringkasan",
  products: "Produk",
  stock: "Stok / Inventory",
  pos: "Penjualan / POS",
  in: "Pembelian / Barang Masuk",
  out: "Barang Keluar",
  history: "Laporan Transaksi",
  access: "Pengaturan Akses User",
  productDetail: "Detail Produk",
  profile: "Profil Pengguna",
  master: "Master Data (Kategori & Satuan)",
  settings: "Pengaturan Toko"
};

export default function MainLayout({
  activeTab,
  onTabChange,
  canAccessTab,
  userRole,
  currentUser,
  onLogout,
  children
}) {
  const title = TAB_TITLES[activeTab] || "Dashboard";

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex">
      <style>
        {`@media print { body * { visibility: hidden; } #printable-receipt, #printable-receipt * { visibility: visible; } #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; } @page { margin: 0; } }`}
      </style>

      {/* SIDEBAR */}
      <aside className="w-60 bg-slate-950 text-slate-100 flex flex-col print:hidden shadow-lg">
        <div className="h-16 flex items-center px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Package size={22} className="text-teal-400" />
            <div>
              <p className="text-sm font-semibold leading-tight tracking-wide">
                Inventory Dashboard
              </p>
              <p className="text-[11px] text-slate-400">
                Vetpicurean System v2.0
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-3 px-2 bg-slate-950 space-y-1">
          {canAccessTab("dashboard") && (
            <NavButton
              active={activeTab === "dashboard"}
              onClick={() => onTabChange("dashboard")}
              icon={<Home size={16} />}
              label="Ringkasan"
            />
          )}
          {canAccessTab("products") && (
            <NavButton
              active={activeTab === "products"}
              onClick={() => onTabChange("products")}
              icon={<Package size={16} />}
              label="Produk"
            />
          )}
          {canAccessTab("stock") && (
            <NavButton
              active={activeTab === "stock"}
              onClick={() => onTabChange("stock")}
              icon={<List size={16} />}
              label="Stok"
            />
          )}
          {canAccessTab("pos") && (
            <NavButton
              active={activeTab === "pos"}
              onClick={() => onTabChange("pos")}
              icon={<ShoppingCart size={16} />}
              label="Penjualan"
            />
          )}
          {canAccessTab("in") && (
            <NavButton
              active={activeTab === "in"}
              onClick={() => onTabChange("in")}
              icon={<ArrowDownCircle size={16} />}
              label="Pembelian"
            />
          )}
          {canAccessTab("out") && (
            <NavButton
              active={activeTab === "out"}
              onClick={() => onTabChange("out")}
              icon={<ArrowUpCircle size={16} />}
              label="Barang Keluar"
            />
          )}
          {canAccessTab("history") && (
            <NavButton
              active={activeTab === "history"}
              onClick={() => onTabChange("history")}
              icon={<TrendingUp size={16} />}
              label="Laporan"
            />
          )}
          <NavButton
            active={false}
            onClick={() => { }}
            icon={<FileText size={16} />}
            label="Dokumen"
          />
          {userRole === "superadmin" && (
            <NavButton
              active={activeTab === "access"}
              onClick={() => onTabChange("access")}
              icon={<Settings size={16} />}
              label="Akses User"
            />
          )}

          <div className="pt-4 pb-1">
            <div className="bg-slate-900 mx-2 h-[1px]"></div>
          </div>

          <NavButton
            active={activeTab === "profile"}
            onClick={() => onTabChange("profile")}
            icon={<User size={16} />}
            label="Profil Saya"
          />

          {(userRole === "superadmin" || userRole === "admin") && (
            <>
              <NavButton
                active={activeTab === "master"}
                onClick={() => onTabChange("master")}
                icon={<Database size={16} />}
                label="Master Data"
              />
              <NavButton
                active={activeTab === "settings"}
                onClick={() => onTabChange("settings")}
                icon={<Settings size={16} />}
                label="Pengaturan Toko"
              />
            </>
          )}
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white/90 backdrop-blur border-b flex items-center justify-between px-6 print:hidden">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={18} className="text-teal-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {title}
              </h1>
              <p className="text-xs text-gray-500">
                Vetpicurean Inventory & Sales Monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-500">
                {userRole ? userRole.toUpperCase() : "USER"}
              </div>
              <div className="text-xs font-semibold text-gray-700">
                {currentUser?.email}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-xs px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 py-4 w-full print:hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
