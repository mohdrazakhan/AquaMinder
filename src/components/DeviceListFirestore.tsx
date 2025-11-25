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
  Database,
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
    // This assumes your device records have `ownerUid: "<uid>"`.
    const devicesRef = ref(db, "devices");
    const q = query(devicesRef, orderByChild("ownerUid"), equalTo(user.uid));

    const unsubscribe = onValue(
      q,
      (snapshot: DataSnapshot) => {
        const value = snapshot.val();
        if (!value) {
          setDevices([]);
          setLoading(false);
          return;
        }
        // snapshot.val() is an object keyed by deviceId
        const list: DeviceEntry[] = Object.keys(value).map((key) => {
          return {
            deviceId: key,
            ...(value[key] || {}),
          };
        });
        // optional: sort by addedAt descending if exists
        list.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
        setDevices(list);
        setLoading(false);
      },
      (err) => {
        console.error("RTDB read error:", err);
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
      <div>
        <p>No devices found for your account yet.</p>
        <p className="text-sm text-slate-500 mt-2">
          Register a device from the device registration page or verify a device using the default device
          id/password.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {devices.map((d) => (
        <div key={d.deviceId} className="rounded border p-4 flex justify-between items-center">
          <div>
            <div className="font-bold text-lg">{d.deviceId}</div>
            {d.meta?.model && <div className="text-sm text-slate-600">{d.meta.model}</div>}
            {d.addedAt && (
              <div className="text-xs text-slate-400">
                Added {new Date(d.addedAt).toLocaleString()}
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
  );
}
