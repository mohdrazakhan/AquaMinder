// src/app/api/admin/devices/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import bcrypt from "bcryptjs";
import { verifyAdminTokenFromHeaderOrCookie } from "@/lib/adminAuth";

export async function GET(req: Request) {
  const adminUser = verifyAdminTokenFromHeaderOrCookie(req);
  if (!adminUser) {
    return NextResponse.json({ error: "unauth" }, { status: 401 });
  }

  try {
    const admin = getAdmin();
    const snap = await admin.database().ref("devices").once("value");

    const devices: any[] = [];
    snap.forEach((childSnap: any) => {
      devices.push(childSnap.val());
    });

    return NextResponse.json({ ok: true, devices });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const adminUser = verifyAdminTokenFromHeaderOrCookie(req);
  if (!adminUser) {
    return NextResponse.json({ error: "unauth" }, { status: 401 });
  }

  const body = await req.json();
  const { prefix = "AQ-B", defaultPassword = "dev-default", count = 1 } = body;

  try {
    const admin = getAdmin();
    const devicesRef = admin.database().ref("devices");

    const snapshot = await devicesRef.once("value");
    let max = 0;

    snapshot.forEach((childSnap: any) => {
      const id = childSnap.key;
      const parts = id?.split("-");
      if (parts && parts.length === 2) {
        const num = Number(parts[1]);
        if (!isNaN(num) && num > max) max = num;
      }
    });

    const results = [];

    for (let i = 1; i <= count; i++) {
      const idx = max + i;
      const deviceId = `${prefix}${String(idx).padStart(2, "0")}`;
      const hash = await bcrypt.hash(defaultPassword, 10);

      const payload = {
        deviceId,
        createdAt: Date.now(),
        factoryDefaultPasswordHash: hash,
        passwordHash: hash,
        verified: false,
        meta: { model: "basic" },
      };

      await devicesRef.child(deviceId).set(payload);
      results.push(payload);
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
