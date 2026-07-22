// src/app/api/schedules/route.ts
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
    const email = decoded.email || "";

    const { deviceId, schedKey, data } = body;
    if (!deviceId || !schedKey || data === undefined) {
      return NextResponse.json({ error: "invalid_params" }, { status: 400 });
    }

    // Ensure device belongs to user or admin
    const devSnap = await admin.database().ref(`tanks/${deviceId}`).get();
    const isSuperAdmin = email === "aquamindr@gmail.com";
    if (!devSnap.exists() || (devSnap.val().ownerUid !== uid && !isSuperAdmin)) {
      return NextResponse.json({ error: "permission_denied" }, { status: 403 });
    }

    let actionText = "";
    if (data === null) {
      // Completely remove the schedule node from Firebase RTDB
      await admin.database().ref(`tanks/${deviceId}/schedules/${schedKey}`).remove();
      actionText = `📅 Schedule ${schedKey} deleted by user`;
    } else {
      // Update the schedule directly in Firebase RTDB
      await admin.database().ref(`tanks/${deviceId}/schedules/${schedKey}`).update(data);
      actionText = `📅 Schedule ${schedKey} updated (${data.hour}:${data.minute}, ${data.duration} mins, active: ${data.active})`;
    }

    // Push an audit log entry so the user sees the schedule update in the terminal feed
    await admin.database().ref(`tanks/${deviceId}/logs`).push(actionText);

    // Notify physical hardware via persistent stream to instantly sync schedules (Eliminates 17,280 daily polling reads!)
    await admin.database().ref(`tanks/${deviceId}/stream/schedule_updated`).set(Date.now());

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Schedule API error:", err);
    return NextResponse.json({ error: err.message || "server_error" }, { status: 500 });
  }
}
