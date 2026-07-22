// src/components/device/DeviceHeaderStatus.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { getClientDatabase } from "@/lib/firebase";

export default function DeviceHeaderStatus({ deviceId }: { deviceId: string }) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null); // null = loading, true/false = known
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  async function handleLogout() {
    try {
      const app = await import("@/lib/firebase").then((m) => m.getClientApp());
      const { getAuth, signOut } = await import("firebase/auth");
      const auth = getAuth(app);
      await signOut(auth);
      setIsMenuOpen(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error", err);
    }
  }

  useEffect(() => {
    let unsubAuth: (() => void) | null = null;
    (async () => {
      try {
        const app = await import("@/lib/firebase").then((m) => m.getClientApp());
        const { getAuth, onAuthStateChanged } = await import("firebase/auth");
        const auth = getAuth(app);
        unsubAuth = onAuthStateChanged(auth, (u) => {
          if (u?.email) setUserEmail(u.email);
        });
      } catch (err) {}
    })();
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
          lastHeartbeatValue = Number(val);
          // ── KEY FIX: Immediately derive online state from the timestamp ──
          // Don't wait for the 3-second interval check. As soon as we get a
          // heartbeat value, determine if it's fresh (< 65s old).
          const isRecent = (Date.now() - Number(val)) < 65000;
          if (isRecent && !currentOnlineState) {
            // Heartbeat is fresh → mark online immediately
            setIsOnline(true);
            currentOnlineState = true;
          } else if (!isRecent && currentOnlineState) {
            // Heartbeat is stale → mark offline immediately
            setIsOnline(false);
            currentOnlineState = false;
          } else if (isOnline === null) {
            // First load: set state based on heartbeat age
            setIsOnline(isRecent);
            currentOnlineState = isRecent;
          }
          setLastSeen(new Date(Number(val)).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "short", timeStyle: "medium" }));
        }
      });

      unsubUpdated = onValue(updatedRef, (snap) => {
        const val = snap.val();
        // Fallback to last_updated if last_heartbeat isn't present
        if (val && !lastHeartbeatValue) {
          setLastSeen(new Date(val).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "short", timeStyle: "medium" }));
        }
      });

      unsubOnline = onValue(onlineRef, (snap) => {
        const val = snap.val();
        // Only trust the Firebase `online` field if we don't have a fresh
        // heartbeat to override it. This prevents stale `online: false` from
        // showing offline right after page load.
        if (lastHeartbeatValue !== null) {
          const isRecent = (Date.now() - lastHeartbeatValue) < 65000;
          if (isRecent) return; // heartbeat says online → ignore stale firebase field
        }
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
        // Same as above — heartbeat timestamp wins over status field
        if (lastHeartbeatValue !== null) {
          const isRecent = (Date.now() - lastHeartbeatValue) < 65000;
          if (isRecent) return;
        }
        if (val === "offline") {
          setIsOnline(false);
          currentOnlineState = false;
        } else if (val === "online") {
          setIsOnline(true);
          currentOnlineState = true;
        }
      });

      // 3. Active Heartbeat Monitor
      // Hardware sends every 30s. We use 65s cutoff = 2+ missed heartbeats
      // before we declare offline. Runs every 5 seconds.
      checkInterval = setInterval(() => {
        if (lastHeartbeatValue) {
          const timeSinceHeartbeat = Date.now() - lastHeartbeatValue;
          if (timeSinceHeartbeat > 65000 && currentOnlineState) {
            // 2+ heartbeats missed → mark offline in Firebase
            updatePresenceState({ online: false, status: "offline" });
            setIsOnline(false);
            currentOnlineState = false;
          } else if (timeSinceHeartbeat <= 65000 && !currentOnlineState) {
            // Heartbeat is fresh again (e.g. after reconnect) → mark online
            updatePresenceState({ online: true, status: "online" });
            setIsOnline(true);
            currentOnlineState = true;
          }
        }
      }, 5000);

    } catch (err) {
      console.warn("DeviceHeaderStatus: subscription failed", err);
    }

    return () => {
      if (unsubAuth) unsubAuth();
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

  // Extract date and time if available
  let hbDate = "";
  let hbTime = "";
  if (lastSeen) {
    const parts = lastSeen.split(", ");
    if (parts.length === 2) {
      hbDate = parts[0];
      hbTime = parts[1];
    } else {
      hbDate = lastSeen;
    }
  }

  return (
    <>
      {/* =========================================
          MOBILE LAYOUT
          ========================================= */}
      <div className="flex md:hidden items-center justify-center w-full py-0.5 font-sans">
        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${isOnline ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
          <span className={`h-2 w-2 rounded-full flex-shrink-0 ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
          <span className={`text-[9px] font-bold uppercase tracking-wider ${isOnline ? "text-emerald-700" : "text-rose-700"}`}>
            {isOnline ? "Device is Online" : "Device is Offline"}
          </span>
        </div>
      </div>

      {/* =========================================
          DESKTOP LAYOUT (Reverted to original)
          ========================================= */}
      <div className="hidden md:flex relative items-center justify-center w-full font-sans mb-1 min-h-[24px]">
        {/* Centered Online/Offline Status */}
        <div className="flex items-center gap-2 justify-center">
          <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
          <span className={`text-xs font-bold uppercase tracking-wider leading-tight ${isOnline ? "text-emerald-700" : "text-rose-700"}`}>
            {isOnline ? "Device Online & Connected to WiFi" : "Device Offline (Operating on Local NVS / RTC)"}
          </span>
        </div>

        {/* Top Right Heartbeat (Absolute right aligned) */}
        {lastSeen && (
          <div className="absolute right-0 text-[10px] text-slate-400 font-medium whitespace-nowrap text-right bg-white pl-2">
            {isOnline ? "Heartbeat:" : "Last seen:"} {lastSeen}
          </div>
        )}
      </div>
    </>
  );
}
