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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setIsMobileMenuOpen(false);
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/logo.png" alt="Aqua Minder" width={36} height={36} className="nav-logo object-contain" />
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">Aqua Minder</span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <Link href="/#features" className="hover:text-slate-900">Features</Link>
          <Link href="/product" className="hover:text-slate-900">Product</Link>
          <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
          <Link href="/about" className="hover:text-slate-900">About</Link>
          <Link href="/contact" className="hover:text-slate-900">Contact</Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden lg:block text-sm text-slate-700 mr-2">{user.email}</div>
              <Link href="/dashboard/connect" className="px-3 py-2 border rounded-md text-sm text-slate-700 hover:bg-slate-50">Connect Device</Link>
              <Link href="/dashboard" className="px-4 py-2 bg-sky-500 text-white rounded-md text-sm shadow-sm hover:bg-sky-600">Dashboard</Link>
              <button onClick={handleLogout} className="px-3 py-2 border rounded-md text-sm text-slate-700 hover:bg-slate-50">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2 border rounded-md text-sm text-slate-700 hover:bg-slate-50">Login</Link>
              <Link href="/signup" className="px-4 py-2 bg-sky-500 text-white rounded-md text-sm shadow-sm hover:bg-sky-600">Sign Up</Link>
              <Link href="/product" className="px-3 py-2 border rounded-md text-sm text-slate-700 hover:bg-slate-50">Buy device</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-md"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Right Slider Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sliding Panel */}
          <div className="relative w-72 max-w-sm h-full bg-white shadow-xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-900">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 px-4 py-6 flex flex-col">
              {/* Mobile Nav Links (Top) */}
              <div className="flex flex-col text-base font-medium text-slate-700 mb-6">
                <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-3 rounded-md hover:bg-slate-50 transition-colors">Features</Link>
                <Link href="/product" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-3 rounded-md hover:bg-slate-50 transition-colors">Product</Link>
                <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-3 rounded-md hover:bg-slate-50 transition-colors">Pricing</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-3 rounded-md hover:bg-slate-50 transition-colors">About</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-3 rounded-md hover:bg-slate-50 transition-colors">Contact</Link>
              </div>

              {/* Mobile Action Buttons (Bottom) */}
              <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-slate-100">
                {user ? (
                  <>
                    <div className="text-sm text-slate-500 px-1 mb-2 truncate text-center font-medium">{user.email}</div>
                    <Link 
                      href="/dashboard/connect" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2.5 border border-slate-200 rounded-md text-sm text-center text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Connect Device
                    </Link>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2.5 bg-sky-500 text-white rounded-md text-sm text-center shadow-sm hover:bg-sky-600 font-medium"
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="px-4 py-2.5 border border-slate-200 rounded-md text-sm text-center text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2.5 border border-slate-200 rounded-md text-sm text-center text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2.5 bg-sky-500 text-white rounded-md text-sm text-center shadow-sm hover:bg-sky-600 font-medium"
                    >
                      Sign Up
                    </Link>
                    <Link 
                      href="/product" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2.5 border border-slate-200 rounded-md text-sm text-center text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Buy device
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
