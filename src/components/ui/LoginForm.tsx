// src/components/ui/LoginForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import SocialLoginButtons from "./SocialLoginButtons";
import { getFirebaseErrorMessage } from "@/lib/firebaseErrors";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setError(getFirebaseErrorMessage(err));
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
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
