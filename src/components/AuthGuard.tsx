"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientApp } from "@/lib/firebase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    (async () => {
      try {
        const app = getClientApp();
        const { getAuth, onAuthStateChanged } = await import("firebase/auth");
        const auth = getAuth(app);
        unsub = onAuthStateChanged(auth, (user) => {
          if (!user) {
            router.replace("/login");
            return;
          }
          setReady(true);
        });
      } catch (err) {
        // If Firebase isn't configured properly, redirect to login as fallback
        console.error("AuthGuard init error", err);
        router.replace("/login");
      }
    })();

    return () => {
      if (unsub) unsub();
    };
  }, [router]);

  if (!ready) return <div className="container py-12">Checking authentication…</div>;

  return <>{children}</>;
}
