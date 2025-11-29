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
  const deviceId = devicePath.replace(/^devices\//, "").split("/")[0];
  const devSnap = await admin.database().ref(`devices/${deviceId}`).get();
  if (!devSnap.exists() || devSnap.val().ownerUid !== uid) {
    return NextResponse.json({ error: "permission_denied" }, { status: 403 });
  }

  // push command
  await admin.database().ref(`commands/${deviceId}`).push({
    cmd,
    payload: payload || {},
    createdAt: Date.now(),
  });

  return NextResponse.json({ ok: true });
}
