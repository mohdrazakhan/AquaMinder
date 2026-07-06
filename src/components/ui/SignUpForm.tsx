// src/components/ui/SignUpForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import SocialLoginButtons from "./SocialLoginButtons";

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { getClientApp } = await import("@/lib/firebase");
      const app = getClientApp();
      const { getAuth, createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName.trim()) {
        await updateProfile(userCredential.user, { displayName: displayName.trim() });
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Sign up error", err);
      setError(err instanceof Error ? err.message : "Account creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white">
        {error && <div className="text-sm text-red-600 p-3 bg-red-50 border border-red-100 rounded">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
            placeholder="Your full name"
          />
        </div>

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
            placeholder="Create a secure password (6+ chars)"
          />
        </div>

        <div className="pt-4 space-y-5">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 disabled:opacity-60 font-bold shadow-sm transition-colors"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-4 text-sm text-slate-600">
            <a
              href="/login"
              className="hover:text-slate-900 hover:underline transition-colors text-center sm:text-left"
            >
              Already have an account? <span className="font-semibold text-slate-900">Log in</span>
            </a>
          </div>
        </div>
      </form>
      
      <SocialLoginButtons />
    </div>
  );
}
