// src/components/ui/NavBar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getClientApp } from "@/lib/firebase";

type UserInfo = {
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
};

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    (async () => {
      try {
        const app = getClientApp();
        const { getAuth, onAuthStateChanged } = await import("firebase/auth");
        const auth = getAuth(app);
        unsub = onAuthStateChanged(auth, (u) => {
          if (!u) {
            setUser(null);
            return;
          }
          setUser({ email: u.email, displayName: u.displayName, photoURL: u.photoURL });
        });
      } catch (err) {
        console.warn("NavBar: Firebase client not available", err);
      }
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  async function handleLogout() {
    try {
      const app = getClientApp();
      const { getAuth, signOut } = await import("firebase/auth");
      const auth = getAuth(app);
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Aqua Minder" width={44} height={44} className="nav-logo" />
            <span className="font-semibold text-lg text-slate-900">Aqua Minder</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <Link href="/#features" className="hover:text-slate-900">Features</Link>
          <Link href="/product" className="hover:text-slate-900">Product</Link>
          <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
          <Link href="/about" className="hover:text-slate-900">About</Link>
          <Link href="/contact" className="hover:text-slate-900">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:block text-sm text-slate-700">{user.email}</div>
              <button onClick={handleLogout} className="px-3 py-2 border rounded-md text-sm text-slate-700 hover:bg-slate-50">Logout</button>
              <Link href="/dashboard" className="px-4 py-2 bg-sky-500 text-white rounded-md text-sm shadow-sm hover:bg-sky-600">Dashboard</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 border rounded-md text-sm text-slate-700 hover:bg-slate-50">Login</Link>
              <Link href="/product" className="px-4 py-2 bg-sky-500 text-white rounded-md text-sm shadow-sm hover:bg-sky-600">Buy device</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
