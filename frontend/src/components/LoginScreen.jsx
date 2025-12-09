import React, { useState } from "react";
import { Package } from "lucide-react";

export default function LoginScreen({ onLogin, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onLogin(email, password);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="w-full max-w-sm bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package size={20} className="text-blue-400" />
          <div>
            <h1 className="text-sm font-semibold">Inventory Dashboard</h1>
            <p className="text-[11px] text-slate-400">
              Login untuk mengakses sistem
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-300 mb-1 block">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 mb-1 block">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-[11px] text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-1 bg-teal-500 hover:bg-teal-600 text-sm font-semibold py-2 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Memproses..." : "Login"}
          </button>
        </form>
        <p className="mt-3 text-[10px] text-slate-500">
          Akun dan role diatur oleh admin melalui backend NestJS.
        </p>
      </div>
    </div>
  );
}
