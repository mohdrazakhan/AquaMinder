// src/app/api/user/devices/route.ts
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const idToken = authHeader.replace(/^Bearer\s+/i, "");
    if (!idToken) return NextResponse.json({ error: "no_token" }, { status: 401 });

    const admin = getAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const snap = await admin.database().ref("devices").orderByChild("ownerUid").equalTo(uid).once("value");
    const devices: any[] = [];
    const val = snap.val();
    if (val) {
      // snapshot.forEach isn't available on plain object - iterate keys
      Object.keys(val).forEach((k) => devices.push(val[k]));
    }
    return NextResponse.json({ ok: true, devices });
  } catch (err) {
    console.error("user/devices error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
