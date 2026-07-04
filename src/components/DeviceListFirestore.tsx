"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
  DataSnapshot,
} from "firebase/database";
import { db, getClientApp } from "@/lib/firebase";

type DeviceEntry = {
  deviceId: string;
  meta?: any;
  addedAt?: number;
  verified?: boolean;
  [k: string]: any;
};

export default function DeviceListFirestore() {
  const [user, setUser] = useState<User | null>(null);
  const [devices, setDevices] = useState<DeviceEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const app = getClientApp ? getClientApp() : null;
    if (!app) {
      setError("Client Firebase app not available.");
      setLoading(false);
      return;
    }
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setDevices(null);
      setLoading(false);
      return;
    }

    if (!db) {
      setError("Realtime Database not initialized in client firebase.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query devices where ownerUid == current user's uid.
    const devicesRef = ref(db, "tanks");
    const q = query(devicesRef, orderByChild("ownerUid"), equalTo(user.uid));

    const unsubscribe = onValue(
      q,
      (snapshot: DataSnapshot) => {
        const value = snapshot.val();
        console.debug("DeviceListFirestore: raw snapshot val:", value, "for uid", user.uid);

        if (!value) {
          setDevices([]);
          setLoading(false);
          return;
        }

        const list: DeviceEntry[] = Object.keys(value).map((key) => ({
          deviceId: key,
          ...(value[key] || {}),
        }));

        list.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
        setDevices(list);
        setLoading(false);
      },
      async (err) => {
        console.error("RTDB read error:", err);

        // ALWAYS trigger fallback to secure /api/my/devices if client onValue fails for any permission/timeout reason
        try {
          const app = getClientApp();
          const auth = getAuth(app);
          const token = await auth.currentUser?.getIdToken();

          const res = await fetch(`/api/my/devices`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          });

          if (res.ok) {
            const json = await res.json();
            const list = (json.devices || []).map((d: any) => ({
              deviceId: d.deviceId,
              ...(d || {}),
            }));

            setDevices(list);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Fallback /api/my/devices failed", e);
        }

        setError("Failed to load devices.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div>Loading devices…</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!user) {
    return (
      <div>
        <p className="mb-2">You must be signed in to see your devices.</p>
        <Link href="/login" className="text-blue-600 underline">
          Sign in
        </Link>
      </div>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <div className="bg-slate-50 border rounded-lg p-8 text-center max-w-2xl mx-auto my-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-2">No devices connected yet</h3>
        <p className="text-slate-600 mb-6">
          Connect your smart water monitoring device to start tracking and controlling it from your portal.
        </p>
        <Link href="/dashboard/connect" className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-md shadow hover:bg-sky-600 transition">
          Connect your first device
        </Link>
        {user && (
          <div className="mt-6 text-xs text-slate-400">
            Debug: signed-in uid: <span className="font-mono">{user.uid}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-600">Managing {devices.length} connected device{devices.length === 1 ? "" : "s"}</p>
        <Link href="/dashboard/connect" className="px-4 py-2 bg-sky-500 text-white font-medium rounded-md shadow-sm hover:bg-sky-600 transition">
          Connect New Device
        </Link>
      </div>
      <div className="space-y-4">
        {devices.map((d) => (
        <div key={d.deviceId} className="rounded border p-4 flex justify-between items-center">
          <div>
            <div className="font-bold text-lg">{d.deviceId}</div>
            {d.meta?.model && <div className="text-sm text-slate-600">{d.meta.model}</div>}
            {d.addedAt && (
              <div className="text-[10px] text-slate-400 font-medium">
                Added {new Date(d.addedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {d.verified ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
            ) : (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Not verified
              </span>
            )}

            <Link
              href={`/dashboard/device/${encodeURIComponent(d.deviceId)}`}
              className="text-white bg-blue-600 px-3 py-1 rounded"
            >
              Open
            </Link>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
