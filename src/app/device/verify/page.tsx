
// src/app/device/verify/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeviceVerifyPage() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!deviceId.trim() || !defaultPassword.trim()) {
      setError("Please enter device ID and default password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/device/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: deviceId.trim(), defaultPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        // server returns structured errors like { error: "already_verified", message: "..." }
        const msg = data?.message || data?.error || "Verification failed";
        setError(msg);
        setLoading(false);
        return;
      }

      // success -> { ok: true, token }
      const { token } = data;
      // Redirect to register page with token
      router.push(`/register?token=${encodeURIComponent(token)}`);
    } catch (err) {
      console.error(err);
      setError("Network error - please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-6">Verify your device</h1>

      <p className="mb-6 text-sm text-gray-600">
        Enter the Device ID and the factory default password printed on your
        device label. After verification you'll be redirected to register an
        owner account for this device.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-100 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Device ID
          </label>
          <input
            className="mt-1 block w-full rounded-md border px-3 py-2"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="e.g. AQ-B01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Default password
          </label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md border px-3 py-2"
            value={defaultPassword}
            onChange={(e) => setDefaultPassword(e.target.value)}
            placeholder="from device label"
            required
          />
        </div>

        <div className="flex gap-3 items-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify & continue"}
          </button>

          <a href="/login" className="text-sm text-gray-600 hover:underline">
            Back to login
          </a>
        </div>
      </form>
    </div>
  );
}
