// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Guard
function ensureClient() {
  if (typeof window === "undefined") {
    throw new Error("getClientDatabase() must be called from client-side code.");
  }
}

export function getClientApp() {
  ensureClient();
  if (!getApps().length) {
    initializeApp(clientConfig);
  }
  return getApps()[0];
}

export function getClientDatabase() {
  const app = getClientApp();
  return getDatabase(app);
}

// convenience default export
export const db =
  typeof window !== "undefined" ? getClientDatabase() : null;
