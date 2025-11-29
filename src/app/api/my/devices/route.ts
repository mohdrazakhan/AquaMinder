import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s*/i, "");
    if (!token) return NextResponse.json({ error: "no_token" }, { status: 401 });

    const admin = getAdmin();
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const snap = await admin.database().ref("devices").orderByChild("ownerUid").equalTo(uid).once("value");
    if (!snap.exists()) return NextResponse.json({ devices: [] });

    const val = snap.val();
    const list = Object.keys(val).map((k) => ({ deviceId: k, ...(val[k] || {}) }));
    return NextResponse.json({ devices: list });
  } catch (err: any) {
    console.error("/api/my/devices error:", err);
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
