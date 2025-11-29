import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, password, status, log } = body;
    if (!deviceId || !password) return NextResponse.json({ error: "missing" }, { status: 400 });

    const admin = getAdmin();
    const devSnap = await admin.database().ref(`devices/${deviceId}`).get();
    if (!devSnap.exists()) return NextResponse.json({ error: "device_not_found" }, { status: 404 });

    const dev = devSnap.val();
    const storedHash = String(dev.passwordHash || "");
    if (!storedHash) return NextResponse.json({ error: "no_password_set" }, { status: 403 });

    const ok = await bcrypt.compare(password, storedHash);
    if (!ok) return NextResponse.json({ error: "invalid_password" }, { status: 403 });

    // write status
    if (typeof status !== "undefined") {
      await admin.database().ref(`devices/${deviceId}/status`).set(status);
    }

    // append log entry if provided
    if (log) {
      const entry = { ...log, ts: Date.now() };
      await admin.database().ref(`devices/${deviceId}/logs`).push(entry);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("/api/device/data error:", err);
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
