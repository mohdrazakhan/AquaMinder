// src/app/admin/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const adminSecret = prompt("Enter admin secret (local test)"); // small dev shortcut
      if (!adminSecret) return setLoading(false);
      const r = await fetch("/api/admin/devices", {
        headers: { Authorization: `Bearer ${adminSecret}` },
      });
      const j = await r.json();
      if (j.ok) setDevices(j.devices || []);
      else console.error(j);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="container py-12">Loading...</div>;

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4">
        {devices.length === 0 ? (
          <div>No devices</div>
        ) : (
          devices.map((d: any) => (
            <div key={d.deviceId} className="p-4 border rounded">
              <div className="font-semibold">{d.deviceId}</div>
              <div>Model: {d.meta?.model}</div>
              <div>Verified: {String(d.verified)}</div>
              <div>Owner: {d.ownerUid || "—"}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
