// src/app/api/admin/devices/route.ts
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { verifyAdminTokenFromHeaderOrCookie } from "@/lib/adminAuth";

export async function GET(req: Request) {
  // basic admin auth
  const adminUser = verifyAdminTokenFromHeaderOrCookie(req);
  if (!adminUser) return NextResponse.json({ error: "unauth" }, { status: 401 });

  try {
    const admin = getAdmin();
    const snap = await admin.database().ref("devices").once("value");
    const val = snap.val() || {};
    const devices: any[] = [];
    Object.keys(val).forEach((k) => devices.push(val[k]));
    return NextResponse.json({ ok: true, devices });
  } catch (err) {
    console.error("admin/devices error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
