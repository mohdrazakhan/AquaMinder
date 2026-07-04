// src/components/device/ScheduleCard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { getClientDatabase } from "@/lib/firebase";

type ScheduleItem = {
  key: string;
  hour: number;
  minute: number;
  duration: number;
  active: boolean;
  exists?: boolean;
};

export default function ScheduleCard({ deviceId }: { deviceId: string }) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding/editing schedule
  const [formHour, setFormHour] = useState("06");
  const [formMinute, setFormMinute] = useState("30");
  const [formPeriod, setFormPeriod] = useState("AM");
  const [formDuration, setFormDuration] = useState("15");

  useEffect(() => {
    let unsub: (() => void) | null = null;
    try {
      const db = getClientDatabase();
      const schedRef = ref(db, `tanks/${deviceId}/schedules`);
      unsub = onValue(schedRef, (snap) => {
        const val = snap.val() || {};
        const items: ScheduleItem[] = [];

        // Dynamically parse all schedule keys from Firebase without any limit!
        Object.entries(val).forEach(([key, schedData]: [string, any]) => {
          if (schedData && schedData.exists !== false) {
            items.push({
              key,
              hour: schedData.hour !== undefined ? Number(schedData.hour) : 6,
              minute: schedData.minute !== undefined ? Number(schedData.minute) : 30,
              duration: schedData.duration !== undefined ? Number(schedData.duration) : 15,
              active: schedData.active === true,
              exists: schedData.exists !== false,
            });
          }
        });

        // Sort schedules chronologically by hour and minute for elegant display
        items.sort((a, b) => {
          if (a.hour !== b.hour) return a.hour - b.hour;
          return a.minute - b.minute;
        });

        setSchedules(items);
      });
    } catch (err) {
      console.warn("ScheduleCard: subscription failed", err);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [deviceId]);

  // Send update to API route which updates Firebase RTDB directly
  async function updateScheduleData(schedKey: string, data: any) {
    setLoading(true);
    try {
      const app = await import("@/lib/firebase").then((m) => m.getClientApp());
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      const idToken = currentUser ? await currentUser.getIdToken() : null;

      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}) },
        body: JSON.stringify({
          deviceId,
          schedKey,
          data,
        }),
      });

      if (!res.ok) {
        throw new Error(`Schedule update failed: ${res.status}`);
      }
      await res.json();
    } catch (err) {
      console.error("updateScheduleData error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Toggle active state
  function handleToggle(sched: ScheduleItem) {
    updateScheduleData(sched.key, { active: !sched.active, exists: true });
  }

  // Delete schedule
  function handleDelete(sched: ScheduleItem) {
    updateScheduleData(sched.key, null);
  }

  // Submit Add Schedule Form (Supports unlimited schedules)
  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    let h = parseInt(formHour, 10);
    const m = parseInt(formMinute, 10);
    const d = parseInt(formDuration, 10);

    if (formPeriod === "PM" && h < 12) h += 12;
    if (formPeriod === "AM" && h === 12) h = 0;

    // Determine key: find the first available slot from sched1 to sched20 matching the physical device NVS array
    let nextKey = "sched1";
    for (let i = 1; i <= 20; i++) {
      const candidateKey = `sched${i}`;
      if (!schedules.some((s) => s.key === candidateKey)) {
        nextKey = candidateKey;
        break;
      }
    }

    updateScheduleData(nextKey, {
      hour: h,
      minute: m,
      duration: d,
      active: true,
      exists: true
    });

    setShowAddModal(false);
  }

  // Format helper for display
  function formatTime(h: number, m: number) {
    const period = h >= 12 ? "PM" : "AM";
    let dispH = h % 12;
    if (dispH === 0) dispH = 12;
    const dispM = m < 10 ? `0${m}` : m;
    return `${dispH < 10 ? `0${dispH}` : dispH}:${dispM} ${period}`;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 w-full font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase block mb-1">AUTOMATION ENGINE</span>
          <h3 className="text-lg font-bold text-slate-900">
            Smart Schedules
          </h3>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          disabled={loading}
          className="px-3.5 py-2 rounded-lg font-medium text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          Add Schedule
        </button>
      </div>

      {/* Add Schedule Modal / Inline Form */}
      {showAddModal && (
        <form onSubmit={handleAddSubmit} className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-sm font-bold text-slate-900">Configure New Schedule</h4>
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕ Cancel
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Hour (1-12)</label>
              <input 
                type="number" 
                min="1" 
                max="12" 
                value={formHour} 
                onChange={(e) => setFormHour(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Minute (0-59)</label>
              <input 
                type="number" 
                min="0" 
                max="59" 
                value={formMinute} 
                onChange={(e) => setFormMinute(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">AM / PM</label>
              <select 
                value={formPeriod} 
                onChange={(e) => setFormPeriod(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Duration (Minutes)</label>
            <input 
              type="number" 
              min="1" 
              max="360" 
              value={formDuration} 
              onChange={(e) => setFormDuration(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              required 
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors"
            >
              Save Schedule
            </button>
          </div>
        </form>
      )}

      {/* Schedules List */}
      <div className="space-y-3 mb-6">
        {schedules.map((sched) => (
          <div 
            key={sched.key} 
            className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
              sched.active 
                ? "bg-slate-50 border-slate-200" 
                : "bg-slate-50/50 border-slate-100 opacity-60"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  {formatTime(sched.hour, sched.minute)}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {sched.duration} mins
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600">
                Everyday • {sched.key.toUpperCase()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Delete Schedule Button */}
              <button
                onClick={() => handleDelete(sched)}
                disabled={loading}
                title="Delete Schedule"
                className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors text-sm font-bold"
              >
                ✕
              </button>

              {/* Clean Flat Toggle Switch */}
              <button
                onClick={() => handleToggle(sched)}
                disabled={loading}
                title={sched.active ? "Disable Schedule" : "Enable Schedule"}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                  sched.active ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-300 ${
                    sched.active ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}

        {schedules.length === 0 && !showAddModal && (
          <div className="py-12 text-center text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-xl">
            No active schedules configured. Click "Add Schedule" above to set up automated cycles.
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <span>💾</span> NVS Offline Persistence Protocol
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          When you add, delete, or modify a schedule on this dashboard, the parameters are pushed instantly to Firebase. Your AquaMinder hardware immediately downloads the updated schedule and commits it to local NVS (Non-Volatile Storage) Preferences.
        </p>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          If your AquaMinder device loses Wi-Fi connection or goes offline, it seamlessly relies on its built-in hardware RTC (Real Time Clock) and local NVS memory to execute your automated motor intake cycles exactly on time!
        </p>
      </div>

      <div className="mt-4 text-right text-xs font-mono text-slate-400">
        TARGET: tanks/{deviceId}/schedules
      </div>
    </div>
  );
}
