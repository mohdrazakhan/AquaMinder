// src/components/ui/SignUpForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

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

      <div className="flex items-center justify-between pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-sky-500 text-white rounded-md text-sm font-medium shadow-sm hover:bg-sky-600 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <a className="text-sm text-slate-700 hover:underline cursor-pointer" href="/login">
          Already have an account? Log in
        </a>
      </div>
    </form>
  );
}
