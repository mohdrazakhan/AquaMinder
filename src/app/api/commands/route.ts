// src/app/api/commands/route.ts
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  const body = await req.json();
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "no_token" }, { status: 401 });

  const admin = getAdmin();
  const decoded = await admin.auth().verifyIdToken(token);
  const uid = decoded.uid;

  // require payload
  const { devicePath, cmd, payload } = body;
  if (!devicePath || !cmd) return NextResponse.json({ error: "invalid" }, { status: 400 });

  // ensure device belongs to uid
  const deviceId = devicePath.replace(/^tanks\//, "").replace(/^devices\//, "").split("/")[0];
  const devSnap = await admin.database().ref(`tanks/${deviceId}`).get();
  if (!devSnap.exists() || devSnap.val().ownerUid !== uid) {
    return NextResponse.json({ error: "permission_denied" }, { status: 403 });
  }

  // Ensure device is currently online before accepting motor/night mode control commands
  const devVal = devSnap.val();
  if (devVal.online === false || devVal.status === "offline") {
    return NextResponse.json({ error: "device_offline", message: "AquaMinder hardware is powered off or disconnected." }, { status: 400 });
  }

  const updates: any = {};
  if (cmd === "motor_on") updates.pump_state = true;
  if (cmd === "motor_off") updates.pump_state = false;
  if (cmd === "night_on") updates.night_mode = true;
  if (cmd === "night_off") updates.night_mode = false;
  if (cmd === "dry_run_override_on") updates.dry_run_override = true;
  if (cmd === "dry_run_override_off") updates.dry_run_override = false;

  // update the root tank reference so AquaMinder hardware detects it instantly
  if (Object.keys(updates).length > 0) {
    await admin.database().ref(`tanks/${deviceId}`).update(updates);
  }

  // also push command to the queue log
  await admin.database().ref(`tanks/${deviceId}/commands`).push({
    cmd,
    payload: payload || {},
    createdAt: Date.now(),
  });

  return NextResponse.json({ ok: true });
}
