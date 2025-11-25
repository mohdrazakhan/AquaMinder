// src/components/device/DeviceRealtime.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { getClientDatabase } from "@/lib/firebase";

type Props = { deviceId: string; onStatus?: (s: any) => void };

export default function DeviceRealtime({ deviceId, onStatus }: Props) {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    let db;
    try {
      db = getClientDatabase(); // will throw if called server-side
    } catch (err) {
      console.error("DeviceRealtime: not running in client", err);
      return;
    }

    const statusRef = ref(db, `devices/${deviceId}/status`);
    const unsub = onValue(statusRef, (snap) => {
      const val = snap.val();
      setStatus(val);
      if (onStatus) onStatus(val);
    });

    return () => unsub();
  }, [deviceId, onStatus]);

  if (!status) return <div>Loading status...</div>;

  return (
    <div>
      {/* Render something if you want; we only store status to parent via onStatus */}
      <pre style={{ display: "none" }}>{JSON.stringify(status)}</pre>
    </div>
  );
}
