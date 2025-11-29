// src/components/device/DeviceRealtime.tsx
"use client";
import React, { useEffect, useState } from "react";
import { getClientDatabase } from "@/lib/firebase";
import { ref, onValue, get } from "firebase/database";

export default function DeviceRealtime({ deviceId, onStatus }: { deviceId: string; onStatus?: (s:any)=>void }) {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const db = getClientDatabase();
    const statusRef = ref(db, `devices/${deviceId}/status`);
    const unsub = onValue(statusRef, (snap) => {
      const val = snap.val();
      setStatus(val);
      if (onStatus) onStatus(val);
    });
    return () => unsub();
  }, [deviceId]);

  if (!status) return <div>Loading status...</div>;
  return <div>Motor: {status.motor ? "ON" : "OFF"}</div>;
}
