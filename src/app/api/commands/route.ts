// src/app/api/commands/route.ts (server)
import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import fs from "fs";
import path from "path";

function initAdmin() {
  if (admin.apps.length) return admin;

  // 1) Try JSON from env FIREBASE_SERVICE_ACCOUNT (stringified JSON)
  const svcEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

  try {
    if (svcEnv) {
      const svc = JSON.parse(svcEnv);
      admin.initializeApp({
        credential: admin.credential.cert(svc),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL,
      });
      return admin;
    }
  } catch (err) {
    console.error("Failed parsing FIREBASE_SERVICE_ACCOUNT:", err);
    // continue to next option
  }

  // 2) Try reading serviceAccount.json file in project root (local dev)
  try {
    const p = path.join(process.cwd(), "serviceAccount.json");
    if (fs.existsSync(p)) {
      const svc = JSON.parse(fs.readFileSync(p, "utf8"));
      admin.initializeApp({
        credential: admin.credential.cert(svc),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL,
      });
      return admin;
    }
  } catch (err) {
    console.error("Failed reading serviceAccount.json:", err);
  }

  // 3) Fall back to application default credentials (if GOOGLE_APPLICATION_CREDENTIALS set)
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL,
    });
    return admin;
  } catch (err) {
    console.error("Failed initializeApp(applicationDefault):", err);
  }

  throw new Error("Could not initialize firebase-admin. Set FIREBASE_SERVICE_ACCOUNT or provide serviceAccount.json or GOOGLE_APPLICATION_CREDENTIALS.");
}

export async function POST(req: Request) {
  try {
    const adminInstance = initAdmin();

    const body = await req.json();
    // expected body: { devicePath, cmd, payload, uid }
    const { devicePath, cmd, payload, uid } = body;

    if (!devicePath || !cmd) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    // OPTIONAL: verify incoming ID token (recommended)
    // const authHeader = req.headers.get("authorization") || "";
    // const idToken = authHeader.replace("Bearer ", "");
    // if (idToken) {
    //   const decoded = await adminInstance.auth().verifyIdToken(idToken);
    //   // use decoded.uid for authorization checks
    // }

    // push a command
    const db = adminInstance.database();
    const cmdsRef = db.ref(`${devicePath}/commands`);
    const newCmdRef = cmdsRef.push();
    await newCmdRef.set({
      cmd,
      payload: payload || {},
      ts: Date.now(),
      byUid: uid || null,
      viaServer: true,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("API /api/commands error:", err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
