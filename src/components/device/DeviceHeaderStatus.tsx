// src/components/device/DeviceHeaderStatus.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { getClientDatabase } from "@/lib/firebase";

export default function DeviceHeaderStatus({ deviceId }: { deviceId: string }) {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    let unsubHb: (() => void) | null = null;
    let unsubOnline: (() => void) | null = null;
    let unsubStatus: (() => void) | null = null;
    let unsubUpdated: (() => void) | null = null;
    let checkInterval: NodeJS.Timeout | null = null;
    let keepAliveInterval: NodeJS.Timeout | null = null;
    
    let lastHeartbeatValue: number | null = null;
    let lastHeartbeatChangeTime = Date.now();
    let currentOnlineState = true;

    async function updatePresenceState(data: any) {
      try {
        const app = await import("@/lib/firebase").then((m) => m.getClientApp());
        const { getAuth } = await import("firebase/auth");
        const auth = getAuth(app);
        const currentUser = auth.currentUser;
        const idToken = currentUser ? await currentUser.getIdToken() : null;

        await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}) },
          body: JSON.stringify({
            deviceId,
            ...data,
          }),
        });
      } catch (err) {
        console.warn("updatePresenceState failed", err);
      }
    }

    try {
      const db = getClientDatabase();
      const hbRef = ref(db, `tanks/${deviceId}/last_heartbeat`);
      const onlineRef = ref(db, `tanks/${deviceId}/online`);
      const statusRef = ref(db, `tanks/${deviceId}/status`);
      const updatedRef = ref(db, `tanks/${deviceId}/last_updated`);

      // 1. Instantly notify physical hardware via Admin API that the web dashboard is open so it starts 15s heartbeats!
      updatePresenceState({ dashboard_active: 1 });

      // Keep updating dashboard_active every 30 seconds while the page remains open
      keepAliveInterval = setInterval(() => {
        updatePresenceState({ dashboard_active: 1 });
      }, 30000);
      
      // 2. Listen to individual tiny nodes to eliminate 99.99% of Firebase download bandwidth billing!
      unsubHb = onValue(hbRef, (snap) => {
        const val = snap.val();
        if (val !== null && val !== undefined) {
          if (lastHeartbeatValue === null || val !== lastHeartbeatValue) {
            lastHeartbeatValue = val;
            lastHeartbeatChangeTime = Date.now();
          }
        }
      });

      unsubOnline = onValue(onlineRef, (snap) => {
        const val = snap.val();
        if (val === false) {
          setIsOnline(false);
          currentOnlineState = false;
        } else if (val === true) {
          setIsOnline(true);
          currentOnlineState = true;
        }
      });

      unsubStatus = onValue(statusRef, (snap) => {
        const val = snap.val();
        if (val === "offline") {
          setIsOnline(false);
          currentOnlineState = false;
        } else if (val === "online") {
          setIsOnline(true);
          currentOnlineState = true;
        }
      });

      unsubUpdated = onValue(updatedRef, (snap) => {
        const val = snap.val();
        if (val) {
          setLastSeen(new Date(val).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }));
        }
      }, (error) => {
        // Ignore permission denied for last_updated if user doesn't own device
      });

      // 3. Active Heartbeat Monitor: Checks if hardware stopped updating last_heartbeat (15s interval -> 35s cutoff)
      checkInterval = setInterval(() => {
        if (currentOnlineState && Date.now() - lastHeartbeatChangeTime > 35000) {
          // The heartbeat value has NOT changed for 35 seconds -> instantly mark offline in Firebase via Admin API
          updatePresenceState({ online: false, status: "offline" });
          setIsOnline(false);
          currentOnlineState = false;
        }
      }, 3000);

    } catch (err) {
      console.warn("DeviceHeaderStatus: subscription failed", err);
    }

    return () => {
      if (unsubHb) unsubHb();
      if (unsubOnline) unsubOnline();
      if (unsubStatus) unsubStatus();
      if (unsubUpdated) unsubUpdated();
      if (checkInterval) clearInterval(checkInterval);
      if (keepAliveInterval) clearInterval(keepAliveInterval);

      // When the user closes the dashboard tab, notify physical hardware to instantly PAUSE heartbeats!
      updatePresenceState({ dashboard_active: 0 });
    };
  }, [deviceId]);

  return (
    <div className="flex items-center gap-2 mb-1 font-sans">
      <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
      <span className={`text-xs font-semibold uppercase tracking-wider ${isOnline ? "text-emerald-700" : "text-rose-700"}`}>
        {isOnline ? "Device Online & Connected to WiFi" : "Device Offline (Operating on Local NVS / RTC)"}
      </span>
      {lastSeen && !isOnline && (
        <span className="text-[10px] text-slate-400 font-medium">
          (Last seen: {lastSeen})
        </span>
      )}
    </div>
  );
}
