import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4400";

const DEFAULT_TABS_BY_ROLE = {
  superadmin: [
    "dashboard",
    "stock",
    "products",
    "pos",
    "in",
    "out",
    "history",
    "master",
    "settings"
  ],
  admin: [
    "dashboard",
    "stock",
    "products",
    "pos",
    "in",
    "out",
    "history",
    "master",
    "settings"
  ],
  gudang: ["dashboard", "stock", "in", "out", "products"],
  finance: ["dashboard", "history", "stock", "products"],
  user: ["dashboard", "pos", "history", "profile"],
  guest: ["dashboard", "history", "documents", "profile"]
};

function getDefaultAllowedTabsForRole(role) {
  const key = String(role || "user").toLowerCase().replace(/\s+/g, "");
  return DEFAULT_TABS_BY_ROLE[key] || DEFAULT_TABS_BY_ROLE.user;
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [allowedTabs, setAllowedTabs] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Restore session dari localStorage (jika ada)
    try {
      const raw = window.localStorage.getItem("vetpicurean_auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.token && parsed.user && parsed.role) {
          setToken(parsed.token);
          setCurrentUser(parsed.user);
          const normalizedRole = String(parsed.role)
            .toLowerCase()
            .replace(/\s+/g, "");
          setUserRole(normalizedRole);
          setAllowedTabs(
            getDefaultAllowedTabsForRole(normalizedRole)
          );
        }
      }
    } catch (e) {
      console.error("Failed to restore auth session", e);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = async (email, password) => {
    setLoginError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      const role = String(data.user?.role || "user")
        .toLowerCase()
        .replace(/\s+/g, "");

      const session = {
        token: data.access_token,
        user: {
          id: data.user.id,
          email: data.user.email
        },
        role
      };

      window.localStorage.setItem(
        "vetpicurean_auth",
        JSON.stringify(session)
      );

      setToken(session.token);
      setCurrentUser(session.user);
      setUserRole(role);
      setAllowedTabs(getDefaultAllowedTabsForRole(role));
    } catch (e) {
      console.error("Login failed", e);
      setLoginError("Email atau password salah atau akun tidak aktif.");
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("vetpicurean_auth");
    setToken(null);
    setCurrentUser(null);
    setUserRole(null);
    setAllowedTabs(null);
  };

  return {
    currentUser,
    userRole,
    authLoading,
    loginError,
    allowedTabs,
    token,
    handleLogin,
    handleLogout
  };
}
