// src/app/api/device/verify/route.ts
import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

function initAdmin() {
  if (admin.apps.length) return admin;

  const svcEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  try {
    if (svcEnv) {
      const svc = JSON.parse(svcEnv);
      admin.initializeApp({
        credential: admin.credential.cert(svc),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
      return admin;
    }
  } catch (e) { /* ignore and fallback */ }

  const p = path.join(process.cwd(), "serviceAccount.json");
  if (fs.existsSync(p)) {
    const svc = JSON.parse(fs.readFileSync(p, "utf8"));
    admin.initializeApp({
      credential: admin.credential.cert(svc),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
    return admin;
  }

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
  return admin;
}

export async function POST(req: Request) {
  try {
    const { deviceId, defaultPassword } = await req.json();
    if (!deviceId || !defaultPassword) {
      return NextResponse.json({ error: "missing_device_or_password" }, { status: 400 });
    }

    const adminApp = initAdmin();
    const db = adminApp.database(); // RTDB

    // RTDB path for device
    const ref = db.ref(`devices/${deviceId}/factoryDefaultPasswordHash`);
    const snap = await ref.once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "device_not_found" }, { status: 404 });
    }

    const factoryHash = String(snap.val() || "");
    if (!factoryHash) return NextResponse.json({ error: "device_no_factory_hash" }, { status: 400 });

    const ok = await bcrypt.compare(defaultPassword, factoryHash);
    if (!ok) return NextResponse.json({ error: "invalid_default_password" }, { status: 403 });

    // generate short token and store under /deviceClaims/<token>
    const token = Math.random().toString(36).slice(2, 10);
    const now = Date.now();
    await db.ref(`deviceClaims/${token}`).set({
      deviceId,
      token,
      createdAt: now,
      expiresAt: now + 15 * 60 * 1000, // 15 minutes
      status: "pending",
    });

    return NextResponse.json({ ok: true, token });
  } catch (err: any) {
    console.error("/api/device/verify error:", err);
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
