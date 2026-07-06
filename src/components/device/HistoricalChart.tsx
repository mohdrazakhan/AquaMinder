"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HistoricalChart({ logs }: { logs: any[] }) {
  // Parse logs to build data points
  const chartData = useMemo(() => {
    const data: { time: string; level: number; fullDate: string; rawTs: number }[] = [];
    
    // Reverse logs because we want chronological order for the chart (left to right)
    // The logs prop comes sorted descending (newest first).
    const sortedLogs = [...logs].reverse();

    sortedLogs.forEach((log) => {
      // Look for events like: "💧 Water Level Changed to 50%"
      // or "Water Level Changed to 100%"
      const match = log.event.match(/Water Level Changed to (\d+)%/i);
      if (match) {
        const dateObj = new Date(log.ts);
        data.push({
          time: dateObj.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }),
          fullDate: dateObj.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          level: parseInt(match[1], 10),
          rawTs: log.ts,
        });
      }
    });

    // If there's no data, we return empty
    return data;
  }, [logs]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Historical Water Level</h3>
        <div className="py-12 text-center text-slate-500 font-medium border border-dashed border-slate-200 rounded-xl">
          Not enough data yet. Waiting for water level changes...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-base font-bold text-slate-900">Historical Water Level</h3>
        <p className="text-xs text-slate-500 mt-0.5">Timeline of recent water level fluctuations</p>
      </div>
      
      <div className="h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "#64748b" }} 
              dy={10} 
            />
            <YAxis 
              domain={[0, 100]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "#64748b" }} 
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-slate-200 shadow-md rounded-lg p-3 text-sm">
                      <div className="font-semibold text-slate-900">{payload[0].payload.fullDate}</div>
                      <div className="text-blue-600 font-medium mt-1">
                        Water Level: {payload[0].value}%
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="level"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorLevel)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
