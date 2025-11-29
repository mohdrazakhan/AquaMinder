// src/components/ui/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Use Firebase client SDK to sign in so the client auth state is populated
      const { getClientApp } = await import("@/lib/firebase");
      const app = getClientApp();
      const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error", err);
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white">
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
          placeholder="Your password"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-sky-500 text-white rounded-md text-sm hover:bg-sky-600 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>

          <a
            className="text-sm text-slate-700 hover:underline cursor-pointer"
            href="/register"
          >
            Register device
          </a>
        </div>

        <a className="text-sm text-slate-700 hover:underline" href="/reset-password">
          Forgot password?
        </a>
      </div>
    </form>
  );
}
