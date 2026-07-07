// src/app/device/verify/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface DeviceInfo {
  name: string;
  email: string;
  connectedAt: number | null;
  createdAt: number | null;
}

export default function DeviceVerifyPage() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDeviceInfo(null);
    setRegistrationToken(null);

    if (!deviceId.trim()) {
      setError("Please enter a device ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/device/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: deviceId.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || data?.error || "Verification failed";
        setError(msg);
        setLoading(false);
        return;
      }

      setDeviceInfo(data.deviceInfo);
      setIsVerified(data.isVerified);
      if (!data.isVerified) {
        setRegistrationToken(data.token);
      }
    } catch (err) {
      console.error(err);
      setError("Network error - please try again.");
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (ts: number | null) => {
    if (!ts) return "N/A";
    return new Date(ts).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-6">Device Information Lookup</h1>

      <p className="mb-6 text-sm text-gray-600">
        Enter the Device ID printed on your device label to lookup its status or register as a new owner.
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

        <div className="flex gap-3 items-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm disabled:opacity-60"
          >
            {loading ? "Looking up…" : "Lookup Device"}
          </button>

          <a href="/login" className="text-sm text-gray-600 hover:underline">
            Back to login
          </a>
        </div>
      </form>

      {deviceInfo && (
        <div className="mt-8 p-6 bg-gray-50 border rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Device Status: <span className={isVerified ? "text-green-600" : "text-amber-500"}>
                {isVerified ? "Registered" : "Not Registered"}
              </span>
            </h2>
            {!isVerified && registrationToken && (
              <button
                onClick={() => router.push(`/register?token=${encodeURIComponent(registrationToken)}`)}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition-colors"
              >
                Register this Device
              </button>
            )}
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-2">
              <span className="font-semibold text-gray-600">Manufacturing Date:</span>
              <span className="text-gray-900">{formatDate(deviceInfo.createdAt)}</span>
            </div>
            
            {isVerified && (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-2">
                  <span className="font-semibold text-gray-600">Owner Name:</span>
                  <span className="text-gray-900">{deviceInfo.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-2">
                  <span className="font-semibold text-gray-600">Owner Email:</span>
                  <span className="text-gray-900">{deviceInfo.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between pb-2">
                  <span className="font-semibold text-gray-600">Connected Date:</span>
                  <span className="text-gray-900">{formatDate(deviceInfo.connectedAt)}</span>
                </div>
              </>
            )}
          </div>
          
          {!isVerified && (
            <div className="mt-4 text-sm text-slate-500 italic">
              This device has not been registered yet. You can register it to your account to start monitoring your water levels.
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs text-slate-500">Need help with this device?</span>
            <a href="/contact" className="text-xs font-semibold text-sky-600 hover:underline">Contact Support</a>
          </div>
        </div>
      )}
    </div>
  );
}
