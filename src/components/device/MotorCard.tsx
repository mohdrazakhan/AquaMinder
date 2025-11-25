// src/components/device/MotorCard.tsx
"use client";

import React, { useState } from "react";

type Props = { deviceId: string; status: any };

export default function MotorCard({ deviceId, status }: Props) {
  const [loading, setLoading] = useState(false);

  // Send command to your server API which will use admin SDK / RTDB
  async function sendCommand(cmd: "motor_on" | "motor_off") {
    setLoading(true);
    try {
      const res = await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          devicePath: `devices/${deviceId}/commands`,
          cmd,
          payload: {},
        }),
      });
      // optional: handle API response
      const json = await res.json();
      // console.log('command result', json);
    } catch (err) {
      console.error("sendCommand failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 rounded-xl border shadow-sm">
      <h2 className="text-xl font-bold mb-2">Status</h2>

      <p className="text-lg font-semibold">
        Motor:{" "}
        <span className={status?.motor ? "text-green-600" : "text-red-600"}>
          {status?.motor ? "ON" : "OFF"}
        </span>
      </p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => sendCommand("motor_on")}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Turn ON
        </button>

        <button
          onClick={() => sendCommand("motor_off")}
          disabled={loading}
          className="bg-red-400 text-white px-4 py-2 rounded-lg"
        >
          Turn OFF
        </button>
      </div>
    </div>
  );
}
