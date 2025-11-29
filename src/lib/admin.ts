// src/lib/admin.ts (server-only)
import admin from "firebase-admin";

let adminApp: admin.app.App | null = null;

function getServiceAccount(): any {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || "";
  if (!raw) {
    // fallback to serviceAccount.json at repo root
    try {
      return require("../../serviceAccount.json");
    } catch (err) {
      throw new Error("service account not found; set FIREBASE_SERVICE_ACCOUNT or add serviceAccount.json");
    }
  }

  // Remove outer quotes if present (safe regex)
  const normalized = raw.trim()
    .replace(/^'(.*)'$/, "$1")
    .replace(/^"(.*)"$/, "$1");

  try {
    return JSON.parse(normalized);
  } catch (e) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT JSON parse error; ensure env var contains valid JSON");
  }
}

export function getAdmin() {
  if (admin.apps.length > 0) return admin;

  const serviceAccount = getServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL,
  });

  return admin;
}
