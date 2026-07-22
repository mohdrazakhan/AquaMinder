"use client";

import React, { useEffect, useState } from "react";
import ClientDeviceWidget from "./ClientDeviceWidget";
import HistoricalChart from "./HistoricalChart";
import ScheduleCard from "./ScheduleCard";
import RapidDropWarning from "./RapidDropWarning";
import { ref, onValue } from "firebase/database";
import { getClientDatabase, getClientApp } from "@/lib/firebase";

type Props = { deviceId: string };

export default function DeviceDashboard({ deviceId }: Props) {
  const [tab, setTab] = useState<"dashboard" | "manual" | "schedule" | "logs" | "settings">("dashboard");
  const [allLogs, setAllLogs] = useState<any[]>([]);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    try {
      const db = getClientDatabase();
      if (!db) return;
      const logsRef = ref(db, `tanks/${deviceId}/logs`);
      unsub = onValue(logsRef, (snap) => {
        const v = snap.val();
        if (!v) {
          setAllLogs([]);
          return;
        }
        const rawArr = Array.isArray(v)
          ? v.filter(Boolean)
          : Object.entries(v).map(([k, val]) => {
              if (typeof val === "string") {
                let eventText = val;
                let ts = Date.now();
                const match = val.match(/^\[(.*?)\]\s*(.*)$/);
                if (match) {
                  const parsedTs = new Date(match[1]).getTime();
                  if (!isNaN(parsedTs)) ts = parsedTs;
                  eventText = match[2];
                }
                return { id: k, event: eventText, ts };
              }
              return { id: k, ...(val as any) };
            });

        // sort descending by timestamp — NO LIMIT, show ALL logs
        rawArr.sort((a: any, b: any) => (b.ts || 0) - (a.ts || 0));
        setAllLogs(rawArr);
      });
    } catch (err) {
      console.warn("DeviceDashboard: failed to subscribe to logs", err);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [deviceId]);

  // Dashboard tab shows last 10 for quick glance
  const recentLogs = allLogs.slice(0, 10);

  return (
    <div className="space-y-2 font-sans">
      {/* Navigation Tabs */}
      <div className="hidden md:flex border-b border-slate-200 gap-6 md:gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button
          onClick={() => setTab("dashboard")}
          className={`font-medium text-sm pb-3 transition-colors ${
            tab === "dashboard"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Dashboard Hub
        </button>

        <button
          onClick={() => setTab("manual")}
          className={`font-medium text-sm pb-3 transition-colors ${
            tab === "manual"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Manual Override
        </button>

        <button
          onClick={() => setTab("schedule")}
          className={`font-medium text-sm pb-3 transition-colors ${
            tab === "schedule"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Schedules
        </button>

        <button
          onClick={() => setTab("logs")}
          className={`font-medium text-sm pb-3 transition-colors ${
            tab === "logs"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Terminal Logs
        </button>

        <button
          onClick={() => setTab("settings")}
          className={`font-medium text-sm pb-3 transition-colors ${
            tab === "settings"
              ? "border-b-2 border-red-600 text-red-600 font-semibold"
              : "text-slate-600 hover:text-red-600"
          }`}
        >
          Settings
        </button>
      </div>

      {/* ============ DASHBOARD HUB (Always shown on mobile, conditional on desktop) ============ */}
      {(tab === "dashboard" || true) && (
        <div className={`space-y-3 ${tab !== 'dashboard' ? 'md:hidden' : ''}`}>
          
          {/* Main widget: Tank + Controls (Always top on mobile) */}
          <ClientDeviceWidget deviceId={deviceId} />

          <RapidDropWarning logs={allLogs} />

          {/* Historical Graph */}
          <HistoricalChart logs={allLogs} />

          {/* Recent Activity (last 10 logs) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
                <p className="text-xs text-slate-500 mt-0.5">Last 10 events</p>
              </div>
              <button
                onClick={() => setTab("logs")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all logs →
              </button>
            </div>

            <div className="space-y-1">
              {recentLogs.map((l, idx) => (
                <div key={l.id || idx} className="py-2.5 border-b border-slate-100 last:border-none flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 break-words">
                      {l.event || JSON.stringify(l)}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(l.ts || 1700000000000).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[10px] flex-shrink-0">
                    #{allLogs.length - allLogs.indexOf(l)}
                  </span>
                </div>
              ))}
              {!recentLogs.length && (
                <div className="py-12 text-center text-slate-500 font-medium border border-dashed border-slate-200 rounded-xl">
                  No recent activity recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ MANUAL OVERRIDE ============ */}
      {tab === "manual" && (
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ClientDeviceWidget deviceId={deviceId} />
          <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit">
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              Manual Override Engine
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Instant hardware control commands are pushed directly to the high-speed Firebase Realtime Database command queue. Your AquaMinder hardware subscribes to this queue with sub-second latency to actuate the motor pump relay immediately.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-700 uppercase tracking-wider mb-1">Queue Status</div>
              <div className="flex justify-between items-center">
                <span>Relay Protocol</span>
                <span className="font-mono text-blue-600 font-bold">GPIO Active High</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Network Protocol</span>
                <span className="font-mono text-emerald-600 font-bold">Secure WSS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ SCHEDULES ============ */}
      {tab === "schedule" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScheduleCard deviceId={deviceId} />
        </div>
      )}

      {/* ============ TERMINAL LOGS (ALL LOGS) ============ */}
      {tab === "logs" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Terminal Logs</h3>
              <p className="text-xs text-slate-500 mt-0.5">Complete system event history from Firebase</p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              {allLogs.length} Total Events
            </span>
          </div>

          <div className="overflow-y-auto max-h-[70vh] pr-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {allLogs.map((l, idx) => (
              <div key={l.id || idx} className="py-3 border-b border-slate-100 last:border-none flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 tracking-wide break-words">
                    {l.event || JSON.stringify(l)}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(l.ts || 1700000000000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[10px] flex-shrink-0">
                  EVENT #{allLogs.length - idx}
                </span>
              </div>
            ))}
            {!allLogs.length && (
              <div className="py-16 text-center text-slate-500 font-medium border border-dashed border-slate-200 rounded-xl">
                No logs recorded in the telemetry queue.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ SETTINGS ============ */}
      {tab === "settings" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit">
          <h3 className="text-lg font-bold text-slate-900 mb-3">
            Device Settings
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Manage your device pairing and ownership settings.
          </p>

          <div className="p-5 border border-red-200 bg-red-50 rounded-xl flex flex-col items-start gap-4">
            <div>
              <h4 className="font-bold text-red-700">Unpair / Factory Reset</h4>
              <p className="text-red-600/80 text-sm mt-1">
                Removing this device will unpair it from your account and set it as an orphan device. Anyone with the device ID will be able to claim it.
              </p>
            </div>
            
            <button
              onClick={async () => {
                if (!confirm("Are you sure you want to remove this device? This will unpair it from your account.")) return;
                
                try {
                  const { getAuth } = await import("firebase/auth");
                  const app = getClientApp();
                  const auth = getAuth(app);
                  const token = await auth.currentUser?.getIdToken();
                  if (!token) throw new Error("Not authenticated");

                  const res = await fetch("/api/device/remove", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ deviceId })
                  });
                  
                  if (res.ok) {
                    alert("Device removed successfully. It is now an orphan device ready for claiming.");
                    window.location.href = "/dashboard";
                  } else {
                    const data = await res.json();
                    alert(data.message || "Failed to remove device.");
                  }
                } catch (e: any) {
                  alert(e.message || "An error occurred.");
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Remove Device
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
