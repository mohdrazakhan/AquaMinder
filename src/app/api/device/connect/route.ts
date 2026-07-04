import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "unauthorized", message: "Missing authorization header" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: "unauthorized", message: "Invalid authorization header" }, { status: 401 });
    }

    const admin = getAdmin();
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (e) {
      console.error("Token verification error", e);
      return NextResponse.json({ error: "unauthorized", message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { deviceId } = body;
    if (!deviceId) {
      return NextResponse.json({ error: "invalid", message: "Device ID is required" }, { status: 400 });
    }

    const snap = await admin.database().ref(`tanks/${deviceId}`).get();
    if (!snap.exists()) {
      return NextResponse.json({ error: "not_found", message: "Device not found in system. Please verify the Device ID." }, { status: 404 });
    }

    const data = snap.val();

    // Check if device is already registered to another user
    if (data.ownerUid && data.ownerUid !== decodedToken.uid) {
      return NextResponse.json({
        error: "already_claimed",
        message: "This device is associated to another person. If you believe this device belongs to you, please connect to Aquaminder support or for immediate solution connect +91 8279677833",
      }, { status: 400 });
    }

    // Connect device to user account
    await admin.database().ref(`tanks/${deviceId}`).update({
      ownerUid: decodedToken.uid,
      verified: true,
      userEmail: decodedToken.email || null,
      verifiedAt: Date.now(),
    });

    return NextResponse.json({ ok: true, deviceId, ownerUid: decodedToken.uid });
  } catch (err: any) {
    console.error("connect error", err);
    return NextResponse.json({ error: "internal", message: err?.message || "Internal server error" }, { status: 500 });
  }
}
