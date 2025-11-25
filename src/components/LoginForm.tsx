"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { ref, get } from "firebase/database";

export default function LoginForm() {
  const [deviceId, setDeviceId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setError("");

    if (!db) {
      setError("Firebase not available.");
      return;
    }

    const snap = await get(ref(db, `devices/${deviceId}`));
    if (!snap.exists()) {
      setError("Device not found.");
      return;
    }

    console.log("Device found:", snap.val());
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
        placeholder="Device ID"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button type="submit">Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
