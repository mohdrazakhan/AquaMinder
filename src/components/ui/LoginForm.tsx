// src/components/ui/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import SocialLoginButtons from "./SocialLoginButtons";

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
    } catch (err: unknown) {
      console.error("Login error", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
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

        <div className="pt-4 space-y-5">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 disabled:opacity-60 font-bold shadow-sm transition-colors"
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-600">
            <a
              href="/signup"
              className="hover:text-slate-900 hover:underline transition-colors text-center sm:text-left"
            >
              Don&apos;t have an account? <span className="font-semibold text-slate-900">Sign up</span>
            </a>

            <div className="flex items-center justify-center sm:justify-end gap-5">
              <a href="/device/verify" className="hover:text-slate-900 hover:underline transition-colors">
                Verify device
              </a>
              <a href="/reset-password" className="hover:text-slate-900 hover:underline transition-colors">
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </form>

      <SocialLoginButtons />
    </div>
  );
}
