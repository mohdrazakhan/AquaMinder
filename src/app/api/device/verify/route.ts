// server route for device verify
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, defaultPassword } = body;
    if (!deviceId || !defaultPassword) return NextResponse.json({ error: "invalid" }, { status: 400 });

    const admin = getAdmin();
    const snap = await admin.database().ref(`devices/${deviceId}`).get();
    if (!snap.exists()) return NextResponse.json({ error: "not_found" }, { status: 404 });

    const data = snap.val();
    // if device already claimed/verified, return an instructive error
    if (data.verified) {
      return NextResponse.json(
        { error: "already_verified", message: "Device already claimed. Contact support or sign in with the owner account." },
        { status: 400 }
      );
    }

    const ok = await bcrypt.compare(defaultPassword, data.factoryDefaultPasswordHash || data.passwordHash || "");
    if (!ok) return NextResponse.json({ error: "invalid_password" }, { status: 403 });

    // Create a temporary token (simple random string)
    const token = Math.random().toString(36).slice(2, 10);
    // store token under /deviceTokens/<token> -> deviceId with TTL (createdAt)
    await admin.database().ref(`deviceRegisterTokens/${token}`).set({
      deviceId,
      createdAt: Date.now(),
    });

    return NextResponse.json({ ok: true, token });
  } catch (err) {
    console.error("verify error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
