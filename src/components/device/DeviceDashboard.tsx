"use client";

import React, { useEffect, useState } from "react";
import ClientDeviceWidget from "./ClientDeviceWidget";
import ScheduleCard from "./ScheduleCard";
import LogsCard from "./LogsCard";
import { ref, onValue } from "firebase/database";
import { getClientDatabase } from "@/lib/firebase";

type Props = { deviceId: string };

export default function DeviceDashboard({ deviceId }: Props) {
  const [tab, setTab] = useState<"dashboard" | "manual" | "schedule" | "logs">("dashboard");
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    try {
      const db = getClientDatabase();
      const logsRef = ref(db, `devices/${deviceId}/logs`);
      unsub = onValue(logsRef, (snap) => {
        const v = snap.val();
        if (!v) {
          setRecentLogs([]);
          return;
        }
        // convert object map to array
        const arr = Array.isArray(v)
          ? v.filter(Boolean)
          : Object.entries(v).map(([k, val]) => ({ id: k, ...(val as any) }));
        // sort descending by timestamp if present
        arr.sort((a: any, b: any) => (b.ts || 0) - (a.ts || 0));
        setRecentLogs(arr.slice(0, 20));
      });
    } catch (err) {
      console.warn("DeviceDashboard: failed to subscribe to logs", err);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [deviceId]);

  // simple SVG timeline visualization: show last N log entries as bars
  function renderLogGraph() {
    if (!recentLogs.length) return <div className="text-sm text-slate-500">No logs available</div>;
    const max = Math.max(...recentLogs.map((l: any) => l.duration || 0), 1);
    return (
      <svg width="100%" height={80} viewBox={`0 0 ${recentLogs.length * 20} 80`}>
        {recentLogs.map((l: any, i: number) => {
          const h = ((l.duration || 0) / max) * 60 + 5;
          return (
            <g key={i} transform={`translate(${i * 20},0)`}> 
              <rect x={2} y={80 - h - 10} width={12} height={h} fill="#2563eb" rx={3} />
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => setTab("dashboard")} className={`px-3 py-2 rounded ${tab === "dashboard" ? "bg-slate-100" : ""}`}>Dashboard</button>
        <button onClick={() => setTab("manual")} className={`px-3 py-2 rounded ${tab === "manual" ? "bg-slate-100" : ""}`}>Manual</button>
        <button onClick={() => setTab("schedule")} className={`px-3 py-2 rounded ${tab === "schedule" ? "bg-slate-100" : ""}`}>Schedule</button>
        <button onClick={() => setTab("logs")} className={`px-3 py-2 rounded ${tab === "logs" ? "bg-slate-100" : ""}`}>Logs</button>
      </div>

      {tab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ClientDeviceWidget deviceId={deviceId} />
          <div className="col-span-2 p-6 rounded-lg border bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Recent activity</h3>
            <div className="mb-4">{renderLogGraph()}</div>
            <ul className="space-y-2 max-h-64 overflow-auto">
              {recentLogs.map((l, idx) => (
                <li key={l.id || idx} className="text-sm text-slate-700">
                  <div className="text-xs text-slate-500">{new Date((l.ts || Date.now())).toLocaleString()}</div>
                  <div>{l.event || JSON.stringify(l)}</div>
                </li>
              ))}
              {!recentLogs.length && <li className="text-sm text-slate-500">No recent activity</li>}
            </ul>
          </div>
        </div>
      )}

      {tab === "manual" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ClientDeviceWidget deviceId={deviceId} />
          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Manual Controls</h3>
            <p className="text-sm text-slate-600">Use the buttons to send on/off commands to your device.</p>
          </div>
        </div>
      )}

      {tab === "schedule" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScheduleCard deviceId={deviceId} />
        </div>
      )}

      {tab === "logs" && (
        <div className="p-6 rounded-lg border bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Logs</h3>
          <ul className="space-y-2 max-h-96 overflow-auto">
            {recentLogs.map((l, idx) => (
              <li key={l.id || idx} className="text-sm text-slate-700">
                <div className="text-xs text-slate-500">{new Date((l.ts || Date.now())).toLocaleString()}</div>
                <div>{l.event || JSON.stringify(l)}</div>
              </li>
            ))}
            {!recentLogs.length && <li className="text-sm text-slate-500">No logs yet</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
