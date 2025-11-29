// src/app/register/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // state
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Read token from query string on the client (safe, runs only in browser)
  useEffect(() => {
    try {
      const qs = typeof window !== "undefined" ? window.location.search : "";
      const params = new URLSearchParams(qs);
      const t = params.get("token");
      if (!t) {
        // No token — redirect to device verify page
        router.replace("/device/verify");
        return;
      }
      setToken(t);
    } catch (e) {
      // If anything goes wrong, redirect to verify (safe fallback)
      router.replace("/device/verify");
    }
    // We only want to run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Missing registration token. Verify device first.");
      return;
    }
    if (!email || !password) {
      setError("Please provide email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/device/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
          email,
          phone: phone || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Registration failed");
        setLoading(false);
        return;
      }

      setMessage("Device registered and account created. Redirecting to login...");
      setLoading(false);

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Unexpected error while registering. Check the server logs.");
      setLoading(false);
    }
  }

  if (token === null) {
    // While we parse the token (very briefly) show a loader to avoid flash
    return <div className="container mx-auto py-12">Checking registration token…</div>;
  }

  return (
    <div className="container mx-auto py-12 max-w-3xl px-4">
      <h1 className="text-3xl font-extrabold mb-6">Register Device</h1>

      {!token ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            You must verify the device first (enter Device ID + default password) to get a temporary registration token.
          </p>
          <p className="mt-2">
            <a className="text-blue-600 underline" href="/device/verify">
              Go to device verify page
            </a>
          </p>
        </div>
      ) : null}

      {message && <div className="mb-4 p-4 rounded bg-green-50 text-green-700">{message}</div>}

      {error && <div className="mb-4 p-4 rounded bg-red-50 text-red-700">{error}</div>}

      <form onSubmit={handleRegister} className="bg-white border rounded p-6 shadow-sm">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email (owner account)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a secure password"
            className="w-full border rounded px-3 py-2"
            required
            minLength={6}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone (optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 555 5555"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
            disabled={loading || !token}
          >
            {loading ? "Registering..." : "Register device"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="px-4 py-2 border rounded bg-white"
            disabled={loading}
          >
            Back to login
          </button>
        </div>
      </form>

      <div className="mt-10 text-sm text-slate-500">
        <p>Note: Registration requires a valid temporary token created from the device verification step.</p>
      </div>
    </div>
  );
}
