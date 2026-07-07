// src/components/ui/ResetPasswordForm.tsx
"use client";

import React, { useState } from "react";
import { getFirebaseErrorMessage } from "@/lib/firebaseErrors";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const { getClientApp } = await import("@/lib/firebase");
      const app = getClientApp();
      const { getAuth, sendPasswordResetEmail } = await import("firebase/auth");
      const auth = getAuth(app);
      
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: unknown) {
      console.error("Password reset error", err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white space-y-6">
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          <p className="font-semibold mb-1">Check your email</p>
          <p>We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.</p>
        </div>
        <a 
          href="/login" 
          className="inline-block w-full text-center px-4 py-3 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors font-bold shadow-sm"
        >
          Return to login
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white">
        <p className="text-sm text-slate-600 mb-6">
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>

        {error && <div className="text-sm text-red-600 p-3 bg-red-50 border border-red-100 rounded">{error}</div>}

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

        <div className="pt-4 space-y-5">
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full px-4 py-3 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 disabled:opacity-60 font-bold shadow-sm transition-colors"
          >
            {loading ? "Sending link..." : "Send reset link"}
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 text-sm text-slate-600">
            <a
              href="/login"
              className="hover:text-slate-900 hover:underline transition-colors"
            >
              Back to login
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
