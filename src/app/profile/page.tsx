"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientApp } from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    (async () => {
      try {
        const app = getClientApp();
        const { getAuth, onAuthStateChanged } = await import("firebase/auth");
        const auth = getAuth(app);
        unsub = onAuthStateChanged(auth, (u) => {
          if (!u) {
            router.push("/login");
          } else {
            setUser(u);
          }
          setLoading(false);
        });
      } catch (err) {
        console.error("Profile: Firebase auth error", err);
        setLoading(false);
      }
    })();

    return () => {
      if (unsub) unsub();
    };
  }, [router]);

  async function handleLogout() {
    try {
      const app = getClientApp();
      const { getAuth, signOut } = await import("firebase/auth");
      const auth = getAuth(app);
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 pb-24 font-sans">
      <main className="w-full px-4 py-6 max-w-md mx-auto">
        
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
            {user.email?.[0].toUpperCase() || "U"}
          </div>
          <h2 className="text-lg font-bold text-slate-900">{user.displayName || "User"}</h2>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>

        {/* Action List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <button 
            onClick={() => router.push("/dashboard/connect")}
            className="w-full flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Connect New Device
            </div>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button 
            onClick={() => window.open("mailto:support@aquaminder.com")}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 text-slate-700 font-medium">
              <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Contact Support
            </div>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full bg-white text-rose-600 font-bold py-3.5 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Sign Out
        </button>
        
        <p className="text-center text-xs text-slate-400 mt-6">
          App Version 1.0.0
        </p>

      </main>
    </div>
  );
}
