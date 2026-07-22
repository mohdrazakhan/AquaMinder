// src/app/dashboard/connect/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { getClientApp } from "@/lib/firebase";

export default function ConnectDevicePage() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!deviceId.trim()) {
      setError("Please enter the Device ID.");
      return;
    }

    setLoading(true);
    try {
      const app = getClientApp();
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth(app);
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        setError("User authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/device/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deviceId: deviceId.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || data?.error || "Failed to connect device.");
        setLoading(false);
        return;
      }

      setSuccess("Device successfully connected to your account! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Connect device error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans">
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 w-full">
          <h1 className="text-xl font-bold text-slate-900 text-center">Pair Device</h1>
        </header>

        <main className="w-full px-4 py-8 max-w-md mx-auto flex flex-col items-center">
          
          <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Connect Aqua Minder</h2>
          <p className="text-slate-500 text-center mb-8 px-4 text-sm">
            Enter the unique Device ID printed on the back of your smart tank monitor to link it to your account.
          </p>

          {success && (
            <div className="w-full mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-medium text-center text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="w-full mb-6 p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-medium text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div>
              <input
                type="text"
                required
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value.toUpperCase())}
                placeholder="Device ID (e.g. AQM001)"
                className="w-full border border-slate-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-center text-lg font-mono uppercase tracking-widest shadow-sm bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full py-4 bg-sky-500 text-white rounded-xl font-bold text-lg shadow-sm hover:bg-sky-600 disabled:opacity-60 transition-colors"
            >
              {loading ? "Pairing..." : "Connect Device"}
            </button>
          </form>
        </main>
      </div>
    </AuthGuard>
  );
}
