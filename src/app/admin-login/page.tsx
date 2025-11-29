// src/app/admin-login/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setErr(data?.error || "Login failed");
      return;
    }
    // redirect to admin dashboard
    router.push("/admin/dashboard");
  }

  return (
    <div className="container mx-auto py-12 max-w-lg px-4">
      <h1 className="text-2xl font-bold mb-4">Admin sign in</h1>
      {err && <div className="mb-4 text-red-600">{err}</div>}
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border px-3 py-2" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border px-3 py-2" placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
