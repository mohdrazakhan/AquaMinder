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
      <div className="container mx-auto py-16 px-4 max-w-2xl">
        <h1 className="text-3xl font-extrabold mb-2">Connect a New Device</h1>
        <p className="text-slate-600 mb-8">
          Enter your Device ID mentioned on your device to link it instantly to your account.
        </p>

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-md font-medium">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-md font-medium text-sm leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Device ID
            </label>
            <input
              type="text"
              required
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="e.g. AQ-B01"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading || !!success}
              className="px-6 py-2 bg-sky-500 text-white rounded-md font-medium shadow-sm hover:bg-sky-600 disabled:opacity-60 transition"
            >
              {loading ? "Connecting..." : "Connect Device"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              disabled={loading || !!success}
              className="px-6 py-2 border rounded-md text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
