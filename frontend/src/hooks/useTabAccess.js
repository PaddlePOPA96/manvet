import { useCallback, useEffect } from "react";

export function useTabAccess({
  activeTab,
  setActiveTab,
  userRole,
  allowedTabs,
  currentUser
}) {
  const baseCanAccess = useCallback(
    (tabId) => {
      if (userRole === "superadmin") return true;
      if (!allowedTabs || allowedTabs.length === 0) return true;
      return allowedTabs.includes(tabId);
    },
    [userRole, allowedTabs]
  );

  const canAccessTab = useCallback(
    (tabId) => {
      if (tabId === "productDetail") {
        // Detail produk mengikuti akses tab Stok
        return baseCanAccess("stock");
      }
      if (tabId === "profile") return true;
      if (
        (userRole === "superadmin" || userRole === "admin") &&
        (tabId === "master" || tabId === "settings")
      ) {
        return true;
      }
      return baseCanAccess(tabId);
    },
    [baseCanAccess]
  );

  useEffect(() => {
    if (!currentUser) return;
    if (canAccessTab(activeTab)) return;

    const order = [
      "dashboard",
      "stock",
      "pos",
      "products",
      "history",
      "in",
      "out"
    ];
    const fallback = order.find((tab) => baseCanAccess(tab));
    if (fallback && fallback !== activeTab) {
      setActiveTab(fallback);
    }
  }, [currentUser, activeTab, canAccessTab, baseCanAccess, setActiveTab]);

  return { canAccessTab };
}
