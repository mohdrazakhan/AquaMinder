"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { getClientDatabase, getClientApp } from "@/lib/firebase";
import MotorCard from "./MotorCard";

export default function ClientDeviceWidget({ deviceId }: { deviceId: string }) {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    let unsubDb: (() => void) | null = null;
    let unsubAuth: (() => void) | null = null;

    const setup = async () => {
      try {
        const { getAuth, onAuthStateChanged } = await import("firebase/auth");
        const app = getClientApp();
        const auth = getAuth(app);

        unsubAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
            const db = getClientDatabase();
            if (!db) return;
            const statusRef = ref(db, `tanks/${deviceId}`);
            
            // Unsubscribe from any previous listener before creating a new one
            if (unsubDb) unsubDb();
            
            unsubDb = onValue(statusRef, (snapshot) => {
              setStatus(snapshot.val());
            }, (error) => {
              // Gracefully handle permission denied without triggering Next.js error overlay
              setStatus({ _error: true, message: error.message });
            });
          } else {
            setStatus(null);
          }
        });
      } catch (err) {
        console.error("Auth setup error:", err);
      }
    };

    setup();

    return () => {
      if (unsubDb) unsubDb();
      if (unsubAuth) unsubAuth();
    };
  }, [deviceId]);

  if (!status) return <p className="text-slate-500 font-medium animate-pulse">Loading status...</p>;
  if (status._error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <h3 className="text-red-700 font-bold mb-2">Access Denied</h3>
      <p className="text-red-600 text-sm">You do not have permission to view this device's real-time status. It may belong to another user.</p>
    </div>
  );

  return <MotorCard deviceId={deviceId} status={status} />;
}
