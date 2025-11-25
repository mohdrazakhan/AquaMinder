// src/app/api/device/register/route.ts
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
    const { token, newPassword, email, phone } = await req.json();
    if (!token || !newPassword || !email) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const adminApp = initAdmin();
    const db = adminApp.database();

    const claimRef = db.ref(`deviceClaims/${token}`);
    const claimSnap = await claimRef.once("value");

    if (!claimSnap.exists()) {
      return NextResponse.json({ error: "invalid_token" }, { status: 400 });
    }

    const claim = claimSnap.val();
    if (claim.status === "done" || claim.expiresAt < Date.now()) {
      return NextResponse.json({ error: "expired_token" }, { status: 400 });
    }

    const deviceId = claim.deviceId;

    // Create or fetch Firebase Auth user
    let user;
    try {
      user = await adminApp.auth().getUserByEmail(email);
    } catch {
      user = await adminApp.auth().createUser({
        email,
        emailVerified: false,
        phoneNumber: phone || undefined,
      });
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update device record
    await db.ref(`devices/${deviceId}`).update({
      ownerUid: user.uid,
      passwordHash: newHash,
      recoveryEmail: email,
      recoveryPhone: phone || null,
      verified: true,
      claimedAt: Date.now(),
    });

    // Mark claim token as used
    await claimRef.update({
      status: "done",
      usedAt: Date.now(),
      usedBy: user.uid,
    });

    return NextResponse.json({ ok: true, ownerUid: user.uid });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
