import React, { Suspense, useRef, useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import StockTab from "./components/StockTab";
import PeriodFilterBar from "./components/PeriodFilterBar";
import MainLayout from "./components/MainLayout";

const DashboardTab = React.lazy(() => import("./components/DashboardTab"));
const ProductManager = React.lazy(() => import("./components/ProductManager"));
const POSSystem = React.lazy(() => import("./components/POSSystem"));
const BatchTransactionForm = React.lazy(() =>
  import("./components/BatchTransactionForm")
);
const UserAccessManager = React.lazy(() =>
  import("./components/UserAccessManager")
);
const HistoryTab = React.lazy(() => import("./components/HistoryTab"));
const ProductDetailTab = React.lazy(() =>
  import("./components/ProductDetailTab")
);
const ProfileTab = React.lazy(() => import("./components/ProfileTab"));
const MasterDataTab = React.lazy(() => import("./components/MasterDataTab"));
const SettingsTab = React.lazy(() => import("./components/SettingsTab"));
import { useAuth } from "./hooks/useAuth";
import { useInventoryData } from "./hooks/useInventoryData";
import {
  CONDITIONS_IN,
  CONDITIONS_OUT
} from "./constants/inventory";
import { usePeriodFilter } from "./hooks/usePeriodFilter";
import { useStockFilters } from "./hooks/useStockFilters";
import { useTabAccess } from "./hooks/useTabAccess";

export default function InventoryApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProductName, setSelectedProductName] = useState("");
  // useInventoryData handles categories now.
  // const [categories, setCategories] = useState... REMOVED

  const [units, setUnits] = useState(() => {
    const saved = localStorage.getItem("vet_units");
    return saved ? JSON.parse(saved) : ["Pcs", "Box", "Kaleng", "Botol", "Kg"];
  });

  // Categories persistence handled by API now.





  const fileInputRef = useRef(null);
  const {
    currentUser,
    userRole,
    authLoading,
    loginError,
    allowedTabs,
    token,
    handleLogin,
    handleLogout
  } = useAuth();

  const {
    products,
    transactions,
    inventoryData,
    categories, // From API
    addTransaction,
    deleteTransaction,
    addStockMutation,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    backupData,
    downloadCSV,
    addCategory,
    deleteCategory,
    refreshCategories,
    adjustStock // Destructure the function
  } = useInventoryData(token);

  useEffect(() => {
    if (token) {
      refreshCategories();
    }
  }, [token]);

  const {
    periodPreset,
    periodFrom,
    periodTo,
    setPeriodPreset,
    setPeriodFrom,
    setPeriodTo,
    filteredTransactions,
    periodSalesByDate,
    periodTotals
  } = usePeriodFilter(transactions, products);

  const {
    searchTerm,
    setSearchTerm,
    showLowStockOnly,
    setShowLowStockOnly,
    conditionChartLimit,
    setConditionChartLimit,
    filteredInventory,
    conditionChartData
  } = useStockFilters(inventoryData);

  const { canAccessTab } = useTabAccess({
    activeTab,
    setActiveTab,
    userRole,
    allowedTabs,
    currentUser
  });

  const canManageProducts =
    userRole === "superadmin" || userRole === "admin";
  const canCreateTransactions =
    userRole === "superadmin" || userRole === "admin";

  const handleLogoutClick = async () => {
    await handleLogout();
    setActiveTab("dashboard");
  };

  const handleRestore = () => {
    alert(
      "Restore langsung ke Firestore dinonaktifkan. Mode Supabase hanya bisa backup ke file lokal."
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-100">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        error={loginError}
      />
    );
  }

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      canAccessTab={canAccessTab}
      userRole={userRole}
      currentUser={currentUser}
      onLogout={handleLogoutClick}
    >
      <PeriodFilterBar
        activeTab={activeTab}
        periodPreset={periodPreset}
        periodFrom={periodFrom}
        periodTo={periodTo}
        setPeriodPreset={setPeriodPreset}
        setPeriodFrom={setPeriodFrom}
        setPeriodTo={setPeriodTo}
      />
      <Suspense
        fallback={
          <div className="py-10 text-center text-sm text-gray-500">
            Memuat konten...
          </div>
        }
      >
        {activeTab === "dashboard" && (
          <DashboardTab
            periodPreset={periodPreset}
            periodFrom={periodFrom}
            periodTo={periodTo}
          />
        )}

        {activeTab === "stock" && (
          <StockTab
            products={products}
            filteredInventory={filteredInventory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showLowStockOnly={showLowStockOnly}
            setShowLowStockOnly={setShowLowStockOnly}
            backupData={backupData}
            downloadCSV={downloadCSV}
            fileInputRef={fileInputRef}
            handleRestore={handleRestore}
            onSelectProduct={(name) => {
              setSelectedProductName(name);
              setActiveTab("productDetail");
            }}
            adjustStockFn={adjustStock} // Pass the function directly
          />
        )}

        {activeTab === "products" && (
          <ProductManager
            products={products}
            categories={categories}
            units={units}
            onAdd={handleAddProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            canManage={canManageProducts}
          />
        )}

        {activeTab === "pos" && (
          <POSSystem
            products={products}
            onSubmit={addTransaction}
            canCreate={canCreateTransactions}
          />
        )}

        {activeTab === "in" && (
          <BatchTransactionForm
            type="IN"
            title="Purchases / Barang Masuk"
            products={products}
            conditions={CONDITIONS_IN}
            onSubmit={addStockMutation}
            bgColor="bg-emerald-50"
            btnColor="bg-emerald-600 hover:bg-emerald-700"
            canCreate={canCreateTransactions}
          />
        )}

        {activeTab === "out" && (
          <BatchTransactionForm
            type="OUT"
            title="Barang Keluar / Penjualan"
            products={products}
            conditions={CONDITIONS_OUT}
            onSubmit={addStockMutation}
            bgColor="bg-red-50"
            btnColor="bg-red-600 hover:bg-red-700"
            canCreate={canCreateTransactions}
          />
        )}

        {activeTab === "history" && (
          <HistoryTab
            transactions={filteredTransactions}
            products={products}
            conditionChartData={conditionChartData}
            conditionChartLimit={conditionChartLimit}
            setConditionChartLimit={setConditionChartLimit}
            onDelete={deleteTransaction}
          />
        )}

        {activeTab === "productDetail" && selectedProductName && (
          <ProductDetailTab
            productName={selectedProductName}
            inventoryData={inventoryData}
            transactions={filteredTransactions}
            onBack={() => setActiveTab("stock")}
          />
        )}

        {activeTab === "access" && userRole === "superadmin" && (
          <UserAccessManager />
        )}

        {activeTab === "profile" && <ProfileTab />}

        {activeTab === "master" && (
          <MasterDataTab
            categories={categories}
            units={units}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
            onUpdateUnits={setUnits}
          />
        )}

        {activeTab === "settings" && <SettingsTab />}
      </Suspense>
    </MainLayout>
  );
}
