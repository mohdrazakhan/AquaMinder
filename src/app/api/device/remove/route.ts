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
      return NextResponse.json({ error: "not_found", message: "Device not found" }, { status: 404 });
    }

    const data = snap.val();

    // Verify ownership or superadmin
    const isSuperAdmin = (decodedToken.email || "") === "aquamindr@gmail.com";
    if (data.ownerUid !== decodedToken.uid && !isSuperAdmin) {
      return NextResponse.json({
        error: "unauthorized",
        message: "You do not have permission to remove this device.",
      }, { status: 403 });
    }

    // Unpair device (Factory Reset ownership)
    await admin.database().ref(`tanks/${deviceId}`).update({
      ownerUid: null,
      userEmail: null,
    });

    return NextResponse.json({ ok: true, deviceId, message: "Device unpaired successfully" });
  } catch (err: any) {
    console.error("remove error", err);
    return NextResponse.json({ error: "internal", message: err?.message || "Internal server error" }, { status: 500 });
  }
}
