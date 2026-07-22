// src/components/device/MotorCard.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import ScheduleCard from "./ScheduleCard";

type Props = { deviceId: string; status: any };

export default function MotorCard({ deviceId, status }: Props) {
  const [loading, setLoading] = useState(false);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

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

      // Direct Firebase RTDB update to ensure instant database reflection
      try {
        const { getClientDatabase } = await import("@/lib/firebase");
        const { ref, update } = await import("firebase/database");
        const db = getClientDatabase();
        const clientUpdates: any = {};
        if (cmd === "motor_on") clientUpdates.pump_state = true;
        if (cmd === "motor_off") clientUpdates.pump_state = false;
        if (cmd === "night_on") clientUpdates.night_mode = true;
        if (cmd === "night_off") clientUpdates.night_mode = false;
        if (cmd === "dry_run_override_on") clientUpdates.dry_run_override = true;
        if (cmd === "dry_run_override_off") clientUpdates.dry_run_override = false;
        if (Object.keys(clientUpdates).length > 0) {
          await update(ref(db, `tanks/${deviceId}`), clientUpdates);
        }
      } catch (directErr) {
        console.warn("Direct RTDB write fallback error", directErr);
      }

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

  // 65s = 2+ missed heartbeats (device sends every 30s). Matches DeviceHeaderStatus threshold.
  const isHeartbeatStale = status?.last_heartbeat 
    ? (Date.now() - Number(status.last_heartbeat)) > 65000 
    : false;

  // Heartbeat timestamp is the primary source of truth. If heartbeat is fresh,
  // the device is online regardless of what the `online` field says in Firebase.
  const isHeartbeatFresh = status?.last_heartbeat
    ? (Date.now() - Number(status.last_heartbeat)) <= 65000
    : false;

  const isOnline = isHeartbeatFresh || (status?.online !== false && status?.status !== "offline" && !isHeartbeatStale);
  const isFlowSensorConnected = status?.flow_sensor_connected !== false && !(isMotorOn && Number(flowRate) === 0);
  const isDryRunOverride = status?.dry_run_override === true;

  const levelLabel = waterLevel >= 100 ? "Full" : waterLevel > 75 ? "High" : waterLevel > 40 ? "Medium" : waterLevel > 15 ? "Low" : "Critical";
  const levelColor = waterLevel >= 75 ? "text-emerald-600" : waterLevel > 40 ? "text-sky-600" : waterLevel > 15 ? "text-amber-600" : "text-rose-600";

  // ── SENSOR DISCONNECTION DETECTION ──────────────────────────────────────
  // Two detection modes:
  //   STRONG  (isSensorError)  - impossible sudden drop detected while dashboard open
  //   SOFT    (isSensorSuspect)- page loaded with level=0 and motor never ran
  const prevLevelRef          = useRef<number | null>(null);
  const prevLevelTimestampRef = useRef<number>(Date.now());
  const consecutiveZeroRef    = useRef<number>(0);   // counts consecutive 0-readings
  const motorEverRanRef       = useRef<boolean>(false); // tracks if motor ran this session
  const [isSensorError,   setIsSensorError]   = useState(false);
  const [isSensorSuspect, setIsSensorSuspect] = useState(false);

  useEffect(() => {
    const currentLevel = waterLevel;
    const prev         = prevLevelRef.current;
    const now          = Date.now();

    // Track if motor ever ran this session (tank empty after pump ran is plausible)
    if (isMotorOn) motorEverRanRef.current = true;

    // ── MODE 1: STRONG — impossible sudden drop ──────────────────────────
    // Previous level > 10% → drops to exactly 0 in one heartbeat while motor OFF
    const timeSinceLastReading = now - prevLevelTimestampRef.current;
    const impossibleSuddenDrop =
      prev !== null     &&
      prev > 10         &&
      currentLevel === 0 &&
      !isMotorOn        &&
      isOnline          &&
      timeSinceLastReading < 90000;  // within one heartbeat window

    if (impossibleSuddenDrop) {
      setIsSensorError(true);
      setIsSensorSuspect(false);
    } else if (currentLevel > 0) {
      // Sensor is reading a real value — clear both error states
      setIsSensorError(false);
      setIsSensorSuspect(false);
      consecutiveZeroRef.current = 0;
    }

    // ── MODE 2: SOFT SUSPECT — level was 0 when page loaded ─────────────
    // Can't do a "drop" comparison, but if:
    //   - device is online (heartbeats are fresh)
    //   - level reads exactly 0 for 2+ consecutive heartbeats
    //   - motor has NOT been running this session (motor draining tank is valid)
    //   - we have NOT detected a strong error (that has its own display)
    if (currentLevel === 0 && isOnline) {
      consecutiveZeroRef.current += 1;
    } else {
      consecutiveZeroRef.current = 0;
    }

    if (
      !isSensorError                     &&
      consecutiveZeroRef.current >= 2    &&
      !motorEverRanRef.current           &&
      isOnline
    ) {
      setIsSensorSuspect(true);
    } else if (currentLevel > 0 || motorEverRanRef.current) {
      setIsSensorSuspect(false);
    }

    // Update previous level only when reading looks valid
    if (currentLevel > 0 || !isSensorError) {
      prevLevelRef.current          = currentLevel;
      prevLevelTimestampRef.current = now;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waterLevel, isMotorOn, isOnline]);
  // ────────────────────────────────────────────────────────────────────────

  const rawHb = status?.last_heartbeat || status?.last_updated;
  const lastSeenFormatted = rawHb
    ? new Date(Number(rawHb)).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "short",
        timeStyle: "medium"
      })
    : null;

  return (
    <div className="space-y-2 font-sans">

      {/* Main Layout: Tank (left) + Controls (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

        {/* ========== LEFT: Water Tank (no card border) ========== */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Tank</span>
            {lastSeenFormatted && (
              <span className="text-[10px] text-slate-500 font-medium">
                Heartbeat: {lastSeenFormatted}
              </span>
            )}
          </div>

          {/* ====== REALISTIC PLASTIC OVERHEAD WATER TANK ====== */}
          <div className="relative mx-auto select-none" style={{ maxWidth: 160, width: '100%' }}>

            <svg viewBox="28 28 190 336" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', overflow: 'visible' }}>
              <defs>
                {/* Cylinder body gradient — dark edges, light center = 3D shading */}
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#5b6e7e" />
                  <stop offset="10%"  stopColor="#8fa5b5" />
                  <stop offset="30%"  stopColor="#d4dde6" />
                  <stop offset="50%"  stopColor="#edf2f7" />
                  <stop offset="70%"  stopColor="#d4dde6" />
                  <stop offset="90%"  stopColor="#8fa5b5" />
                  <stop offset="100%" stopColor="#5b6e7e" />
                </linearGradient>

                {/* Dome radial gradient */}
                <radialGradient id="domeGrad" cx="38%" cy="32%" r="68%">
                  <stop offset="0%"   stopColor="#dde6f0" />
                  <stop offset="55%"  stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#5b6e7e" />
                </radialGradient>

                {/* Bottom cap gradient */}
                <radialGradient id="bottomCapGrad" cx="50%" cy="30%" r="70%">
                  <stop offset="0%"   stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </radialGradient>

                {/* Lid gradient */}
                <radialGradient id="lidGrad" cx="35%" cy="30%" r="65%">
                  <stop offset="0%"   stopColor="#b0c4d4" />
                  <stop offset="100%" stopColor="#5b6e7e" />
                </radialGradient>

                {/* Water fill gradient */}
                <linearGradient id="waterFillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor={isOnline ? "#0369a1" : "#475569"} stopOpacity="0.95" />
                  <stop offset="40%"  stopColor={isOnline ? "#38bdf8" : "#94a3b8"} stopOpacity="0.85" />
                  <stop offset="100%" stopColor={isOnline ? "#0369a1" : "#475569"} stopOpacity="0.95" />
                </linearGradient>

                {/* Water top surface */}
                <radialGradient id="waterTopGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor={isOnline ? "#bae6fd" : "#e2e8f0"} />
                  <stop offset="100%" stopColor={isOnline ? "#0ea5e9" : "#94a3b8"} />
                </radialGradient>

                {/* Clip path matching the tank body interior */}
                <clipPath id="tankBodyClip">
                  <path d="M 24 62 L 216 62 L 216 308 Q 216 330 120 330 Q 24 330 24 308 Z" />
                </clipPath>

                {/* Drop shadow filter */}
                <filter id="tankShadowFx" x="-12%" y="-5%" width="124%" height="125%">
                  <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="rgba(0,0,0,0.22)" />
                </filter>
              </defs>

              {/* ── GROUND SHADOW ── */}
              <ellipse cx="120" cy="360" rx="88" ry="11" fill="rgba(0,0,0,0.10)" />

              {/* ── TANK BODY + BOTTOM CAP (with drop shadow) ── */}
              <g filter="url(#tankShadowFx)">
                {/* Bottom dome cap */}
                <ellipse cx="120" cy="318" rx="96" ry="22" fill="url(#bottomCapGrad)" />
                {/* Main cylinder walls */}
                <rect x="24" y="62" width="192" height="256" fill="url(#bodyGrad)" />
              </g>

              {/* ── WATER FILL (clipped to tank interior) ── */}
              <g clipPath="url(#tankBodyClip)" className="tank-glow">

                {/* Water volume rectangle */}
                <rect
                  x="24"
                  y={318 - (waterLevel / 100) * 256}
                  width="192"
                  height={(waterLevel / 100) * 256}
                  fill="url(#waterFillGrad)"
                  style={{ transition: 'y 1.2s cubic-bezier(0.4,0,0.2,1), height 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                />

                {/* Wave layer 1 */}
                {waterLevel > 2 && (
                  <path
                    className="tank-wave-1"
                    d="M 24 8 Q 72 2 120 8 T 216 8 V 28 H 24 Z"
                    fill={isOnline ? "rgba(186,230,253,0.65)" : "rgba(203,213,225,0.55)"}
                    transform={`translate(0, ${318 - (waterLevel / 100) * 256 - 14})`}
                  />
                )}

                {/* Wave layer 2 */}
                {waterLevel > 2 && (
                  <path
                    className="tank-wave-2"
                    d="M 24 10 Q 72 4 120 10 T 216 10 V 28 H 24 Z"
                    fill={isOnline ? "rgba(56,189,248,0.4)" : "rgba(148,163,184,0.4)"}
                    transform={`translate(0, ${318 - (waterLevel / 100) * 256 - 9})`}
                  />
                )}

                {/* Bubbles — only when motor is ON */}
                {isMotorOn && isOnline && (
                  <>
                    <circle cx="68"  cy={312} r="4"   fill="rgba(255,255,255,0.5)"  className="bubble-a" />
                    <circle cx="142" cy={308} r="3"   fill="rgba(255,255,255,0.4)"  className="bubble-b" />
                    <circle cx="178" cy={314} r="2.5" fill="rgba(255,255,255,0.35)" className="bubble-c" />
                  </>
                )}

                {/* Surface ripples — only when motor is ON */}
                {isMotorOn && isOnline && (
                  <>
                    <circle cx="120" cy={318 - (waterLevel / 100) * 256 + 5} r="4" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5">
                      <animate attributeName="r" values="4;32" dur="1.6s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="120" cy={318 - (waterLevel / 100) * 256 + 5} r="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1">
                      <animate attributeName="r" values="4;32" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </g>

              {/* ── WATER TOP SURFACE ELLIPSE ── */}
              {waterLevel > 1 && (
                <ellipse
                  cx="120"
                  cy={318 - (waterLevel / 100) * 256}
                  rx="96" ry="16"
                  fill="url(#waterTopGrad)"
                  opacity="0.88"
                  style={{ transition: 'cy 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                />
              )}

              {/* ── HORIZONTAL RIBS (plastic tank texture) ── */}
              {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                const ribY = 92 + i * 34;
                return (
                  <g key={i}>
                    {/* Rib shadow groove */}
                    <ellipse cx="120" cy={ribY + 3} rx="96" ry="6"  fill="rgba(0,0,0,0.08)" />
                    {/* Rib highlight */}
                    <ellipse cx="120" cy={ribY - 2} rx="96" ry="3.5" fill="rgba(255,255,255,0.22)" />
                    {/* Rib groove center */}
                    <ellipse cx="120" cy={ribY}     rx="96" ry="2.5" fill="rgba(71,85,105,0.18)" />
                  </g>
                );
              })}

              {/* ── DOME TOP (drawn over ribs) ── */}
              <ellipse cx="120" cy="62" rx="96" ry="26" fill="url(#domeGrad)" stroke="#8fa5b5" strokeWidth="1.5" />

              {/* Dome specular highlight */}
              <ellipse cx="94" cy="53" rx="32" ry="11" fill="white" opacity="0.22" />
              <ellipse cx="82" cy="56" rx="14" ry="5"  fill="white" opacity="0.15" />

              {/* ── LID / CAP (concentric rings) ── */}
              <ellipse cx="120" cy="44" rx="36" ry="12" fill="#6b8394" />
              <ellipse cx="120" cy="41" rx="30" ry="10" fill="url(#lidGrad)" />
              <ellipse cx="120" cy="38" rx="22" ry="7.5" fill="#607d8b" />
              <ellipse cx="120" cy="36" rx="14" ry="5"   fill="#546e7a" />
              <ellipse cx="120" cy="34" rx="6"  ry="2.5" fill="#455a64" />
              {/* Lid highlight */}
              <ellipse cx="110" cy="33" rx="7" ry="2.5" fill="white" opacity="0.18" />

              {/* ── INLET PIPE (top side of dome) ── */}
              <ellipse cx="75" cy="52" rx="13" ry="8" fill="#607d8b" stroke="#455a64" strokeWidth="1" />
              <ellipse cx="75" cy="50" rx="9"  ry="5" fill="#37474f" />
              <ellipse cx="75" cy="49" rx="5"  ry="3" fill="#263238" />

              {/* ── WATER POUR STREAM (when motor ON) ── */}
              {isMotorOn && isOnline && (
                <g className="pour-fall">
                  <rect
                    x="71" y="58"
                    width="8"
                    height={Math.max(4, 318 - (waterLevel / 100) * 256 - 58)}
                    rx="4"
                    fill="url(#waterFillGrad)"
                    opacity="0.82"
                  />
                  <circle cx="68" cy="68" r="3"   fill="#38bdf8" opacity="0.75" className="drop-a" />
                  <circle cx="84" cy="76" r="2.5" fill="#38bdf8" opacity="0.65" className="drop-b" />
                  <circle cx="75" cy="84" r="2"   fill="#bae6fd" opacity="0.55" className="drop-c" />
                </g>
              )}

              {/* ── GLASS GLARE STRIP (front highlight) ── */}
              <rect
                x="38" y="70" width="20" height="242"
                rx="10"
                fill="white"
                opacity="0.16"
                className="tank-glare"
              />
              {/* Secondary subtle glare */}
              <rect x="64" y="70" width="8" height="200" rx="4" fill="white" opacity="0.07" />

              {/* ── BOTTOM OUTLET VALVE ── */}
              <circle cx="120" cy="330" r="10" fill="#607d8b" stroke="#455a64" strokeWidth="1.5" />
              <circle cx="120" cy="330" r="6"  fill="#475569" />
              <circle cx="120" cy="330" r="3"  fill="#37474f" />
              <circle cx="118" cy="328" r="1.5" fill="rgba(255,255,255,0.2)" />

              {/* ── LEVEL TICK MARKS (right side) ── */}
              {[0, 25, 50, 75, 100].map((pct) => {
                const tickY = 318 - (pct / 100) * 256;
                return (
                  <g key={pct}>
                    <line x1="220" y1={tickY} x2="232" y2={tickY} stroke="#94a3b8" strokeWidth="1.5" />
                    <text x="235" y={tickY + 4} fontSize="9" fill="#94a3b8" fontWeight="600">{pct}</text>
                  </g>
                );
              })}

              {/* ── PERCENTAGE TEXT ── */}
              {isSensorError ? (
                <>
                  {/* Sensor error icon (warning triangle) */}
                  <text x="120" y="185" textAnchor="middle" fontSize="32">
                    ⚠️
                  </text>
                  <text
                    x="120" y="210"
                    textAnchor="middle"
                    fontSize="28"
                    fontWeight="800"
                    fill="#92400e"
                  >
                    — %
                  </text>
                  {/* Sensor error label pill */}
                  <rect x="66" y="216" width="108" height="22" rx="11" fill="rgba(251,191,36,0.9)" />
                  <text
                    x="120" y="232"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="#78350f"
                  >
                    SENSOR ERROR
                  </text>
                </>
              ) : (
                <>
                  <text
                    x="120" y="198"
                    textAnchor="middle"
                    fontSize="54"
                    fontWeight="800"
                    fill={waterLevel > 40 ? "#ffffff" : "#1e293b"}
                    style={{ filter: waterLevel > 40 ? 'drop-shadow(0 2px 10px rgba(0,0,0,0.45))' : 'none' }}
                  >
                    {waterLevel}%
                  </text>
                  {/* Level label pill */}
                  <rect x="80" y="208" width="80" height="22" rx="11"
                    fill={waterLevel > 40 ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.88)"}
                  />
                  <text
                    x="120" y="224"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={
                      waterLevel > 40 ? "#ffffff"
                      : waterLevel >= 75 ? "#059669"
                      : waterLevel > 15 ? "#d97706"
                      : "#e11d48"
                    }
                  >
                    {levelLabel.toUpperCase()}
                  </text>
                </>
              )}

              {/* ── SCAN LINE (premium effect) ── */}
              <rect x="26" y="62" width="188" height="5" fill="rgba(255,255,255,0.05)" className="tank-scan" />

            </svg>
          </div>
          {/* end SVG wrapper */}

          {/* Tank Status Text */}
          <div className="mt-1 text-center">
            {isSensorError ? (
              // STRONG: impossible drop detected — wire almost certainly unplugged
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span>⚠️</span>
                <span>Sensor wire may be unplugged</span>
              </div>
            ) : isSensorSuspect ? (
              // SOFT: level has been 0 for 2+ heartbeats with no motor activity
              <div className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span>Check sensor connection</span>
              </div>
            ) : (
              <p className="text-sm text-slate-500 font-medium">
                {!isOnline
                  ? "Device offline — showing last known level"
                  : isMotorOn
                  ? "🚿 Pump active — water flowing into tank"
                  : "💧 Tank is on standby"}
              </p>
            )}
          </div>

        </div>
        {/* ===== end LEFT tank card ===== */}

        {/* ========== RIGHT: Controls + Telemetry (compact) ========== */}
        <div className="lg:col-span-3 space-y-2">

          {/* Motor Pump Control */}
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${!isOnline ? "bg-slate-400" : isMotorOn ? "bg-emerald-500" : "bg-rose-500"}`} />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Motor Pump</h3>
                  <p className="text-[11px] text-slate-500">{!isOnline ? "System Offline" : isMotorOn ? "Running" : "Standby"}</p>
                </div>
              </div>
              {/* Smooth Sliding Pill Segmented Toggle for Motor Pump */}
              <div className="relative flex bg-slate-100 p-0.5 rounded-full w-24 select-none">
                <div
                  className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full transition-all duration-300 ease-out shadow-sm ${
                    isMotorOn
                      ? "left-0.5 bg-emerald-500"
                      : "left-[calc(50%+1px)] bg-rose-500"
                  }`}
                />
                <button
                  onClick={() => sendCommand("motor_on")}
                  disabled={!isOnline || loading || isMotorOn}
                  className={`relative z-10 w-1/2 py-1 text-center text-xs font-bold transition-colors duration-200 ${
                    isMotorOn ? "text-white" : "text-slate-500 hover:text-slate-800"
                  } ${(!isOnline || loading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {loading && activeCommand === "motor_on" ? "…" : "ON"}
                </button>
                <button
                  onClick={() => sendCommand("motor_off")}
                  disabled={!isOnline || loading || !isMotorOn}
                  className={`relative z-10 w-1/2 py-1 text-center text-xs font-bold transition-colors duration-200 ${
                    !isMotorOn ? "text-white" : "text-slate-500 hover:text-slate-800"
                  } ${(!isOnline || loading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {loading && activeCommand === "motor_off" ? "…" : "OFF"}
                </button>
              </div>
            </div>
          </div>

          {/* Night Mode Control */}
          <div className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${!isOnline ? "bg-slate-300" : isNightMode ? "bg-purple-600" : "bg-slate-300"}`} />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Night Mode</h3>
                  <p className="text-[11px] text-slate-500">{!isOnline ? "System Offline" : isNightMode ? "Active — LEDs off" : "Inactive"}</p>
                </div>
              </div>
              {/* Smooth Sliding Pill Segmented Toggle for Night Mode */}
              <div className="relative flex bg-slate-100 p-0.5 rounded-full w-24 select-none">
                <div
                  className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full transition-all duration-300 ease-out shadow-sm ${
                    isNightMode
                      ? "left-0.5 bg-purple-600"
                      : "left-[calc(50%+1px)] bg-slate-600"
                  }`}
                />
                <button
                  onClick={() => sendCommand("night_on")}
                  disabled={!isOnline || loading || isNightMode}
                  className={`relative z-10 w-1/2 py-1 text-center text-xs font-bold transition-colors duration-200 ${
                    isNightMode ? "text-white" : "text-slate-500 hover:text-slate-800"
                  } ${(!isOnline || loading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {loading && activeCommand === "night_on" ? "…" : "ON"}
                </button>
                <button
                  onClick={() => sendCommand("night_off")}
                  disabled={!isOnline || loading || !isNightMode}
                  className={`relative z-10 w-1/2 py-1 text-center text-xs font-bold transition-colors duration-200 ${
                    !isNightMode ? "text-white" : "text-slate-500 hover:text-slate-800"
                  } ${(!isOnline || loading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {loading && activeCommand === "night_off" ? "…" : "OFF"}
                </button>
              </div>
            </div>
          </div>

          {/* Row: 2-Column Split — Dry Run Protection (Left) | Schedules (Right) */}
          <div className="grid grid-cols-2 gap-2">
            {/* Left: Dry Run Protection */}
            <div className={`bg-white border rounded-xl p-3 flex flex-col justify-between ${isDryRunOverride ? "border-red-200" : "border-slate-200"}`}>
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm flex-shrink-0">{isDryRunOverride ? "🚨" : !isFlowSensorConnected ? "⚠️" : "🛡️"}</span>
                  <h3 className="text-xs font-bold text-slate-900 truncate">Dry Run</h3>
                </div>
                {/* Smooth Sliding Toggle Switch for Dry Run */}
                <button
                  onClick={() => sendCommand(isDryRunOverride ? "dry_run_override_off" : "dry_run_override_on")}
                  disabled={!isOnline || loading}
                  className={`relative w-9 h-5 rounded-full transition-colors duration-300 ease-in-out flex-shrink-0 ${
                    isDryRunOverride ? "bg-red-500" : "bg-emerald-500"
                  } ${(!isOnline || loading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  title="Toggle Dry Run Protection Override"
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                      isDryRunOverride ? "translate-x-[18px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              <p className={`text-[10px] font-semibold truncate ${isDryRunOverride ? "text-red-600" : !isFlowSensorConnected ? "text-amber-600" : "text-emerald-600"}`}>
                {isDryRunOverride
                  ? "DISABLED"
                  : !isFlowSensorConnected
                  ? "FAULT"
                  : "ACTIVE"}
              </p>
            </div>

            {/* Right: Schedules (Whole card acts as button, no blue edit badge) */}
            <button
              type="button"
              onClick={() => setShowScheduleModal(true)}
              className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between hover:border-sky-400 hover:shadow-sm transition-all text-left w-full cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm flex-shrink-0">⏰</span>
                <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-sky-600 transition-colors">Schedules</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                Add / Remove timers
              </p>
            </button>
          </div>

          {/* Full Screen / Full Responsive Schedule Manager Modal */}
          {showScheduleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-0 sm:p-4">
              <div className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">⏰</span>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">Smart Schedules</h3>
                      <p className="text-xs text-slate-500 font-medium">Configure automated motor timing cycles</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Modal Content */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
                  <ScheduleCard deviceId={deviceId} />
                </div>
              </div>
            </div>
          )}

          {/* Telemetry Grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Flow Rate */}
            <div className={`border rounded-xl p-3 ${!isFlowSensorConnected ? "bg-slate-50 border-slate-200" : "bg-white border-slate-200"}`}>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">Flow Rate</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold tracking-tight ${!isFlowSensorConnected ? "text-slate-400" : "text-slate-900"}`}>{flowRate}</span>
                <span className="text-[10px] font-semibold text-sky-600">L/min</span>
              </div>
            </div>

            {/* Total Volume */}
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">Total Vol.</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 tracking-tight">{totalVolume}</span>
                <span className="text-[10px] font-semibold text-sky-600">L</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-white border border-slate-200 rounded-xl p-3">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">Temp.</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 tracking-tight">{temperature ?? "—"}</span>
                {temperature && <span className="text-[10px] font-semibold text-sky-600">°C</span>}
              </div>
              {!temperature && <p className="text-[9px] text-slate-400 mt-0.5">Pro only</p>}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
