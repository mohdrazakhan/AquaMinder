// src/app/api/presence/route.ts
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "no_token" }, { status: 401 });

    const admin = getAdmin();
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const { deviceId, dashboard_active, online, status } = body;
    if (!deviceId) {
      return NextResponse.json({ error: "invalid_params" }, { status: 400 });
    }

    // Ensure device belongs to user
    const devSnap = await admin.database().ref(`tanks/${deviceId}`).get();
    if (!devSnap.exists() || devSnap.val().ownerUid !== uid) {
      return NextResponse.json({ error: "permission_denied" }, { status: 403 });
    }

    const updates: any = {};
    if (dashboard_active !== undefined) {
      updates.dashboard_active = dashboard_active;
      updates["stream/dashboard_active"] = dashboard_active;
    }
    if (online !== undefined) updates.online = online;
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length > 0) {
      await admin.database().ref(`tanks/${deviceId}`).update(updates);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Presence API error:", err);
    return NextResponse.json({ error: err.message || "server_error" }, { status: 500 });
  }
}
