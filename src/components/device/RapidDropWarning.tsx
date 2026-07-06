"use client";

import React, { useMemo } from "react";

type Props = {
  logs: any[];
};

export default function RapidDropWarning({ logs }: Props) {
  // Calculate average drops and check for rapid drop
  const analysis = useMemo(() => {
    if (!logs || logs.length === 0) return { status: "WAITING", reason: "No logs found." };

    // Sort logs chronologically (oldest first)
    const sortedLogs = [...logs].sort((a, b) => a.ts - b.ts);
    const firstLogTs = sortedLogs[0].ts;
    const daysActive = (Date.now() - firstLogTs) / (1000 * 60 * 60 * 24);

    let lastLevel = -1;
    let lastLevelTs = -1;
    const dropDurations: number[] = [];

    // State machine to find valid drops (100->75, 75->50, 50->25)
    sortedLogs.forEach((log) => {
      const match = log.event.match(/Water Level Changed to (\d+)%/i);
      if (match) {
        const currLevel = parseInt(match[1], 10);
        const currTs = log.ts;

        // Valid drop: exact 25% decrease AND not dropping to 0%
        if (lastLevel !== -1 && lastLevel - currLevel === 25 && currLevel > 0) {
          const duration = currTs - lastLevelTs;
          // Ignore drops that are negative (glitch) or incredibly small (sub 1 second)
          if (duration > 1000) {
            dropDurations.push(duration);
          }
        }

        // Update state
        lastLevel = currLevel;
        lastLevelTs = currTs;
      }
    });

    if (dropDurations.length === 0) {
      return { 
        status: "LEARNING", 
        daysActive, 
        reason: "Waiting for water level drops (e.g., 100% → 75%) to establish a baseline." 
      };
    }

    const totalDrops = dropDurations.length;
    const sumDurations = dropDurations.reduce((a, b) => a + b, 0);
    const avgDuration = sumDurations / totalDrops;
    const mostRecentDrop = dropDurations[totalDrops - 1];

    // Warning Threshold: If the most recent drop is faster than 30% of the historical average
    const isRapid = mostRecentDrop < (avgDuration * 0.3);

    return {
      status: isRapid ? "WARNING" : (daysActive >= 7 ? "SAFE" : "LEARNING"),
      daysActive,
      avgDurationMs: avgDuration,
      recentDurationMs: mostRecentDrop,
      dropCount: totalDrops,
      isRapid,
    };
  }, [logs]);

  // Formatting helpers
  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins} min`;
    const hrs = (mins / 60).toFixed(1);
    return `${hrs} hr`;
  };

  if (analysis.status === "WAITING") {
    return null;
  }

  // Visuals based on status
  let bgColor = "bg-slate-50";
  let borderColor = "border-slate-200";
  let iconColor = "text-slate-400";
  let titleColor = "text-slate-700";
  let icon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  if (analysis.status === "WARNING" || analysis.isRapid) {
    bgColor = "bg-red-50";
    borderColor = "border-red-200";
    iconColor = "text-red-500";
    titleColor = "text-red-800";
    icon = (
      <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  } else if (analysis.status === "SAFE") {
    bgColor = "bg-emerald-50";
    borderColor = "border-emerald-200";
    iconColor = "text-emerald-500";
    titleColor = "text-emerald-800";
    icon = (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  return (
    <div className={`rounded-xl border p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center ${bgColor} ${borderColor} transition-colors mb-6`}>
      <div className={`p-2.5 rounded-full bg-white shadow-sm border border-black/5 ${iconColor}`}>
        {icon}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`font-bold ${titleColor}`}>
            {analysis.status === "WARNING" || analysis.isRapid ? "Rapid Drop Detected!" : "Smart Leak Detection"}
          </h3>
          
          {(analysis.status === "LEARNING" && !analysis.isRapid) && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              Learning Mode
            </span>
          )}
          {analysis.status === "SAFE" && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              Active
            </span>
          )}
        </div>
        
        <p className="text-sm text-slate-600 leading-relaxed">
          {analysis.status === "WARNING" || analysis.isRapid
            ? `Warning: Your water tank dropped a probe level in just ${formatTime(analysis.recentDurationMs!)}, which is drastically faster than your historical average of ${formatTime(analysis.avgDurationMs!)}. This could indicate a burst pipe or severe leak.`
            : analysis.status === "LEARNING"
              ? `Your system is currently learning your household's unique water usage patterns (Day ${Math.max(1, Math.floor(analysis.daysActive!))} of 7). It will automatically alert you of abnormal drops.`
              : `Your water usage is normal. The system is actively monitoring against your 7-day rolling average (${formatTime(analysis.avgDurationMs!)} per level drop).`}
        </p>
      </div>

      {(analysis.status === "WARNING" || analysis.isRapid) && (
        <button className="whitespace-nowrap px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors w-full sm:w-auto mt-2 sm:mt-0">
          Dismiss Alert
        </button>
      )}
    </div>
  );
}
