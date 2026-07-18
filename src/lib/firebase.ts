// src/lib/firebase.ts (client-only)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

export function getClientApp() {
  if (typeof window === "undefined") {
    // never initialize client SDK on server
    throw new Error("getClientApp() must be called from client-side code.");
  }
  
  // Check if Firebase config is complete
  if (!clientConfig.projectId || !clientConfig.apiKey) {
    console.warn("Firebase config is incomplete. Running in preview mode.");
    return null;
  }
  
  try {
    const app = !getApps().length ? initializeApp(clientConfig) : getApp();
    return app;
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
    return null;
  }
}

export function getClientDatabase() {
  const app = getClientApp();
  if (!app) return null;
  try {
    return getDatabase(app);
  } catch (error) {
    console.warn("Firebase database initialization failed:", error);
    return null;
  }
}

// convenience default export: db only when running in browser
export const db = typeof window !== "undefined" ? getClientDatabase() : null;
