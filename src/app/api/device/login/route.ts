// src/app/api/device/login/route.ts
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
  } catch {}
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
    const { deviceId, password } = await req.json();
    if (!deviceId || !password) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const adminApp = initAdmin();
    const db = adminApp.database();

    // read device node
    const devRef = db.ref(`devices/${deviceId}`);
    const snap = await devRef.once("value");
    if (!snap.exists()) return NextResponse.json({ error: "device_not_found" }, { status: 404 });

    const device = snap.val();
    const storedHash = String(device.passwordHash || "");
    if (!storedHash) return NextResponse.json({ error: "no_password_set" }, { status: 400 });

    const ok = await bcrypt.compare(password, storedHash);
    if (!ok) return NextResponse.json({ error: "invalid_password" }, { status: 403 });

    // ensure device has an ownerUid
    const ownerUid = device.ownerUid;
    if (!ownerUid) return NextResponse.json({ error: "device_unclaimed" }, { status: 403 });

    // create Firebase custom token for that ownerUid
    const customToken = await adminApp.auth().createCustomToken(ownerUid);

    return NextResponse.json({ ok: true, customToken, ownerUid });
  } catch (err: any) {
    console.error("/api/device/login error:", err);
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
