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
  createdAt?: string;
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

        Object.entries(val).forEach(([key, schedData]: [string, any]) => {
          if (schedData && schedData.exists !== false) {
            let createdDateStr = "Everyday";
            if (schedData.createdAt) {
              const dateObj = new Date(Number(schedData.createdAt));
              if (!isNaN(dateObj.getTime())) {
                createdDateStr = dateObj.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                });
              }
            }
            items.push({
              key,
              hour: schedData.hour !== undefined ? Number(schedData.hour) : 6,
              minute: schedData.minute !== undefined ? Number(schedData.minute) : 30,
              duration: schedData.duration !== undefined ? Number(schedData.duration) : 15,
              active: schedData.active === true,
              createdAt: createdDateStr,
              exists: schedData.exists !== false,
            });
          }
        });

        // Sort schedules chronologically by hour and minute
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

  // Send update to API route
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

  // Submit Add Schedule Form
  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    let h = parseInt(formHour, 10);
    const m = parseInt(formMinute, 10);
    const d = parseInt(formDuration, 10);

    if (formPeriod === "PM" && h < 12) h += 12;
    if (formPeriod === "AM" && h === 12) h = 0;

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
      exists: true,
      createdAt: Date.now(),
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
    <div className="bg-white rounded-xl w-full font-sans">
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">Automated Timing</span>
          <h3 className="text-base font-extrabold text-slate-900">
            Active Schedules
          </h3>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          disabled={loading}
          className="px-4 py-2 rounded-lg font-bold text-xs bg-sky-500 hover:bg-sky-600 text-white shadow-sm transition-colors flex items-center gap-1.5"
        >
          <span>+</span> Create Schedule
        </button>
      </div>

      {/* Add Schedule Form */}
      {showAddModal && (
        <form onSubmit={handleAddSubmit} className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>⏰</span> New Schedule Config
            </h4>
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-1 rounded hover:bg-slate-200/50"
            >
              ✕ Cancel
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Hour (1-12)</label>
              <input 
                type="number" 
                min="1" 
                max="12" 
                value={formHour} 
                onChange={(e) => setFormHour(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 text-center focus:outline-none focus:border-sky-500"
                required 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Minute (0-59)</label>
              <input 
                type="number" 
                min="0" 
                max="59" 
                value={formMinute} 
                onChange={(e) => setFormMinute(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 text-center focus:outline-none focus:border-sky-500"
                required 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">AM / PM</label>
              <select 
                value={formPeriod} 
                onChange={(e) => setFormPeriod(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Duration (Minutes)</label>
            <div className="flex gap-1.5 mb-2">
              {["5", "10", "15", "30", "45", "60"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFormDuration(preset)}
                  className={`flex-1 py-1 text-xs font-bold rounded border transition-colors ${
                    formDuration === preset
                      ? "bg-sky-500 text-white border-sky-500"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {preset}m
                </button>
              ))}
            </div>
            <input 
              type="number" 
              min="1" 
              max="360" 
              value={formDuration} 
              onChange={(e) => setFormDuration(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:border-sky-500"
              required 
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button 
              type="submit"
              className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
            >
              Save Schedule
            </button>
          </div>
        </form>
      )}

      {/* Schedules List (Sleek Card Rows) */}
      {schedules.length > 0 ? (
        <div className="space-y-3 mb-6">
          {schedules.map((sched) => (
            <div
              key={sched.key}
              className={`bg-white border rounded-2xl p-4 shadow-sm transition-all duration-200 flex items-center justify-between gap-3 ${
                sched.active
                  ? "border-slate-200 hover:border-sky-300 hover:shadow-md"
                  : "border-slate-200/60 bg-slate-50/50 opacity-70"
              }`}
            >
              {/* Left Info Column */}
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {formatTime(sched.hour, sched.minute)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200/80 whitespace-nowrap">
                    ⏱ {sched.duration} mins
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-slate-600">
                    📅 {sched.createdAt || "Everyday"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono uppercase">
                    • {sched.key}
                  </span>
                </div>
              </div>

              {/* Right Controls Column */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Active Status & Switch */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold hidden sm:inline ${sched.active ? "text-emerald-600" : "text-slate-400"}`}>
                    {sched.active ? "Active" : "Paused"}
                  </span>
                  <button
                    onClick={() => handleToggle(sched)}
                    disabled={loading}
                    title={sched.active ? "Disable Schedule" : "Enable Schedule"}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                      sched.active ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                        sched.active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(sched)}
                  disabled={loading}
                  title="Delete Schedule"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showAddModal && (
          <div className="py-10 text-center text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-xl mb-4 bg-slate-50/50">
            No active schedules configured. Click "+ Create Schedule" above to set up automated cycles.
          </div>
        )
      )}

      {/* Short & Clean Offline Note Banner */}
      <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 font-medium">
        <span className="text-base flex-shrink-0">📶</span>
        <div>
          <strong className="font-bold">Offline Operation Supported:</strong> Schedules work offline as well — even if your AquaMinder device is not connected to Wi-Fi, it will execute your automated cycles on time using local hardware RTC & memory.
        </div>
      </div>
    </div>
  );
}
