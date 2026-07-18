// src/components/device/MotorCard.tsx
"use client";

import React, { useState } from "react";

type Props = { deviceId: string; status: any };

export default function MotorCard({ deviceId, status }: Props) {
  const [loading, setLoading] = useState(false);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);

  async function sendCommand(cmd: "motor_on" | "motor_off" | "night_on" | "night_off" | "dry_run_override_on" | "dry_run_override_off") {
    setLoading(true);
    setActiveCommand(cmd);
    try {
      const app = await import("@/lib/firebase").then((m) => m.getClientApp());
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth(app);
      const currentUser = auth.currentUser;
      const idToken = currentUser ? await currentUser.getIdToken() : null;

      const res = await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}) },
        body: JSON.stringify({
          devicePath: `tanks/${deviceId}/commands`,
          cmd,
          payload: {},
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Command failed: ${res.status} ${res.statusText}`);
      }
      await res.json();
    } catch (err: any) {
      console.error("sendCommand failed", err);
      alert(`Command failed: ${err.message || "Device may be offline."}`);
    } finally {
      setLoading(false);
      setActiveCommand(null);
    }
  }

  const isMotorOn = status?.pump_state || status?.motor;
  const isNightMode = status?.night_mode;
  const flowRate = status?.flow_rate !== undefined ? Number(status.flow_rate).toFixed(1) : "0.0";
  const totalVolume = status?.total_volume !== undefined ? Number(status.total_volume).toFixed(1) : "0.0";
  const temperature = status?.temperature !== undefined ? Number(status.temperature).toFixed(1) : null;

  const waterLevel = status?.water_level !== undefined
    ? Number(status.water_level)
    : status?.level !== undefined
    ? Number(status.level)
    : 68;

  const isOnline = status?.online !== false && status?.status !== "offline";
  const isFlowSensorConnected = status?.flow_sensor_connected !== false && !(isMotorOn && Number(flowRate) === 0);
  const isDryRunOverride = status?.dry_run_override === true;

  const levelLabel = waterLevel >= 100 ? "Full" : waterLevel > 75 ? "High" : waterLevel > 40 ? "Medium" : waterLevel > 15 ? "Low" : "Critical";
  const levelColor = waterLevel >= 75 ? "text-emerald-600" : waterLevel > 40 ? "text-sky-600" : waterLevel > 15 ? "text-amber-600" : "text-rose-600";

  const [expandControls, setExpandControls] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6 font-sans">
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes waterWave {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25%) translateY(-2px); }
          100% { transform: translateX(-50%) translateY(0); }
        }
        @keyframes waterWave2 {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(25%) translateY(-3px); }
          100% { transform: translateX(50%) translateY(0); }
        }
        @keyframes pourStream {
          0% { transform: scaleY(0); opacity: 0; }
          20% { transform: scaleY(1); opacity: 1; }
          80% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0); opacity: 0; }
        }
        @keyframes pourDrop {
          0% { transform: translateY(-8px); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(60px); opacity: 0; }
        }
        @keyframes bubbleRise {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-40px) scale(0.5); opacity: 0; }
        }
        .wave-surface {
          animation: waterWave 4s ease-in-out infinite;
        }
        .wave-surface-2 {
          animation: waterWave2 3s ease-in-out infinite;
        }
        .pour-stream {
          animation: pourStream 1.2s ease-in-out infinite;
          transform-origin: top;
        }
        .pour-drop {
          animation: pourDrop 0.8s linear infinite;
        }
        .pour-drop-2 {
          animation: pourDrop 0.8s linear infinite 0.3s;
        }
        .pour-drop-3 {
          animation: pourDrop 0.8s linear infinite 0.6s;
        }
        .bubble {
          animation: bubbleRise 2s ease-out infinite;
        }
        .bubble-2 {
          animation: bubbleRise 2.5s ease-out infinite 0.5s;
        }
        .bubble-3 {
          animation: bubbleRise 1.8s ease-out infinite 1s;
        }
      `}</style>

      {/* Mobile-First Layout: Full-width tank on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">

        {/* ========== LEFT: Big Animated Water Tank - Mobile First ========== */}
        <div className="lg:col-span-2 bg-gradient-to-br from-sky-50 to-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Tank</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isOnline
                ? "bg-sky-100 border-sky-300 text-sky-700"
                : "bg-slate-100 border-slate-200 text-slate-500"
            }`}>
              {isOnline ? "Live" : "Offline"}
            </span>
          </div>

          {/* Tank Container - Responsive height */}
          <div className="relative w-full max-w-[180px] sm:max-w-[220px] mx-auto" style={{ height: "280px" }}>
            {/* Inlet Pipe (top) */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-slate-300 rounded-t-md z-30 border border-slate-400 border-b-0" />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-slate-400 rounded-sm z-30" />

            {/* Water Pouring Animation (only when pump is ON) */}
            {isMotorOn && isOnline && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
                {/* Main stream */}
                <div className="w-1.5 h-16 bg-gradient-to-b from-sky-400 to-sky-500 rounded-full pour-stream opacity-80" />
                {/* Side drops */}
                <div className="absolute top-0 -left-1.5 w-1 h-1 rounded-full bg-sky-400 pour-drop" />
                <div className="absolute top-0 left-2.5 w-1 h-1 rounded-full bg-sky-400 pour-drop-2" />
                <div className="absolute top-2 left-0 w-0.5 h-0.5 rounded-full bg-sky-300 pour-drop-3" />
              </div>
            )}

            {/* Tank Body */}
            <div className="absolute top-3 inset-x-0 bottom-0 border-2 border-slate-300 rounded-2xl overflow-hidden bg-white">
              {/* Water Fill */}
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out"
                style={{ height: `${Math.max(5, Math.min(100, waterLevel))}%` }}
              >
                {/* Wave Surface */}
                <div className="absolute -top-2 left-0 w-[200%] h-4 overflow-hidden pointer-events-none">
                  <svg className="wave-surface" viewBox="0 0 400 20" preserveAspectRatio="none" style={{ width: "200%", height: "100%" }}>
                    <path d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 T250 10 T300 10 T350 10 T400 10 V20 H0Z"
                      fill={isOnline ? "#38bdf8" : "#94a3b8"} fillOpacity="0.5" />
                  </svg>
                </div>
                <div className="absolute -top-2 left-0 w-[200%] h-4 overflow-hidden pointer-events-none">
                  <svg className="wave-surface-2" viewBox="0 0 400 20" preserveAspectRatio="none" style={{ width: "200%", height: "100%" }}>
                    <path d="M0 12 Q25 4 50 12 T100 12 T150 12 T200 12 T250 12 T300 12 T350 12 T400 12 V20 H0Z"
                      fill={isOnline ? "#0ea5e9" : "#64748b"} fillOpacity="0.4" />
                  </svg>
                </div>

                {/* Water body */}
                <div className={`w-full h-full ${isOnline ? "bg-gradient-to-b from-sky-400/80 to-sky-600/90" : "bg-gradient-to-b from-slate-400/70 to-slate-500/80"}`} />

                {/* Bubbles when pump is ON */}
                {isMotorOn && isOnline && (
                  <>
                    <div className="absolute bottom-4 left-[30%] w-2 h-2 rounded-full bg-white/40 bubble" />
                    <div className="absolute bottom-6 left-[55%] w-1.5 h-1.5 rounded-full bg-white/30 bubble-2" />
                    <div className="absolute bottom-2 left-[70%] w-1 h-1 rounded-full bg-white/35 bubble-3" />
                  </>
                )}
              </div>

              {/* Level percentage text */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center">
                  <span className={`text-4xl font-extrabold tracking-tight ${waterLevel > 40 ? "text-white drop-shadow" : "text-slate-800"}`}>
                    {waterLevel}%
                  </span>
                  <div className={`text-sm font-semibold mt-1 ${waterLevel > 40 ? "text-white/80" : levelColor}`}>
                    {levelLabel}
                  </div>
                </div>
              </div>

              {/* Tank level markers */}
              <div className="absolute right-2 top-2 bottom-2 w-5 flex flex-col justify-between items-end z-10">
                {["100", "75", "50", "25", "0"].map((mark) => (
                  <div key={mark} className="flex items-center gap-1">
                    <span className="text-[9px] text-slate-400 font-medium">{mark}</span>
                    <div className="w-2 h-px bg-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tank Status Text */}
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              {!isOnline
                ? "Device offline — showing last known level"
                : isMotorOn
                ? "Pump active — water flowing into tank"
                : "Tank is on standby"}
            </p>
          </div>
        </div>

        {/* ========== RIGHT: Controls + Telemetry - Mobile First ========== */}
        <div className="lg:col-span-3 space-y-3 sm:space-y-4">

          {/* Motor Pump Control - Always Visible */}
          <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${!isOnline ? "bg-slate-400" : isMotorOn ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Motor Pump</h3>
                  <p className="text-xs text-slate-500">{!isOnline ? "Offline" : isMotorOn ? "Running" : "Standby"}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => sendCommand("motor_on")}
                  disabled={!isOnline || loading || isMotorOn}
                  className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                    !isOnline || isMotorOn
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : loading && activeCommand === "motor_on"
                      ? "bg-emerald-600 text-white cursor-wait opacity-80"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {loading && activeCommand === "motor_on" ? "..." : "ON"}
                </button>
                <button
                  onClick={() => sendCommand("motor_off")}
                  disabled={!isOnline || loading || !isMotorOn}
                  className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                    !isOnline || !isMotorOn
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : loading && activeCommand === "motor_off"
                      ? "bg-rose-600 text-white cursor-wait opacity-80"
                      : "bg-rose-500 hover:bg-rose-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {loading && activeCommand === "motor_off" ? "..." : "OFF"}
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Additional Controls */}
          <button
            onClick={() => setExpandControls(!expandControls)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors group"
          >
            <span className="text-sm font-semibold text-slate-700">More Controls</span>
            <svg className={`w-5 h-5 text-slate-500 transition-transform ${expandControls ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {expandControls && (
            <>
              {/* Night Mode Control */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${!isOnline ? "bg-slate-300" : isNightMode ? "bg-purple-600" : "bg-slate-300"}`} />
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">Night Mode</h3>
                      <p className="text-xs text-slate-500">{!isOnline ? "Offline" : isNightMode ? "Active" : "Inactive"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => sendCommand("night_on")}
                      disabled={!isOnline || loading || isNightMode}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors ${
                        !isOnline || isNightMode
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                          : loading && activeCommand === "night_on"
                          ? "bg-purple-600 text-white cursor-wait opacity-80"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                    >
                      {loading && activeCommand === "night_on" ? "..." : "ON"}
                    </button>
                    <button
                      onClick={() => sendCommand("night_off")}
                      disabled={!isOnline || loading || !isNightMode}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors ${
                        !isOnline || !isNightMode
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                          : loading && activeCommand === "night_off"
                          ? "bg-slate-700 text-white cursor-wait opacity-80"
                          : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                      }`}
                    >
                      {loading && activeCommand === "night_off" ? "..." : "OFF"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Dry Run Protection */}
              <div className={`bg-white border rounded-xl p-4 sm:p-5 animate-in fade-in slide-in-from-top-2 ${isDryRunOverride ? "border-red-200 bg-red-50/50" : "border-slate-200"}`}>
                <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">{isDryRunOverride ? "🚨" : !isFlowSensorConnected ? "⚠️" : "🛡️"}</span>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">Dry Run Protection</h3>
                      <p className={`text-xs ${isDryRunOverride ? "text-red-600" : !isFlowSensorConnected ? "text-amber-600" : "text-emerald-600"}`}>
                        {isDryRunOverride
                          ? "DISABLED"
                          : !isFlowSensorConnected
                          ? "Sensor fault"
                          : "Active"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => sendCommand(isDryRunOverride ? "dry_run_override_off" : "dry_run_override_on")}
                    disabled={!isOnline || loading}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
                      isDryRunOverride ? "bg-red-500" : "bg-emerald-500"
                    } ${(!isOnline || loading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                        isDryRunOverride ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Telemetry Grid - Responsive */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-2">
            {/* Flow Rate */}
            <div className={`border rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all ${!isFlowSensorConnected ? "bg-slate-50 border-slate-200" : "bg-white border-slate-200"}`}>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Flow</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl sm:text-2xl font-bold tracking-tight ${!isFlowSensorConnected ? "text-slate-400" : "text-slate-900"}`}>{flowRate}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-sky-600 flex-shrink-0">L/m</span>
              </div>
            </div>

            {/* Total Volume */}
            <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Volume</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{totalVolume}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-sky-600 flex-shrink-0">L</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Temp</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{temperature ?? "—"}</span>
                {temperature && <span className="text-[10px] sm:text-xs font-semibold text-sky-600 flex-shrink-0">°C</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
