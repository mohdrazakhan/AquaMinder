import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, password } = body;
    if (!deviceId || !password) return NextResponse.json({ error: "missing" }, { status: 400 });

    const admin = getAdmin();
    const devSnap = await admin.database().ref(`devices/${deviceId}`).get();
    if (!devSnap.exists()) return NextResponse.json({ error: "device_not_found" }, { status: 404 });

    const dev = devSnap.val();
    const storedHash = String(dev.passwordHash || "");
    if (!storedHash) return NextResponse.json({ error: "no_password_set" }, { status: 403 });

    const ok = await bcrypt.compare(password, storedHash);
    if (!ok) return NextResponse.json({ error: "invalid_password" }, { status: 403 });

    // read commands for this device
    const cmdsSnap = await admin.database().ref(`commands/${deviceId}`).get();
    const cmds: any[] = [];
    if (cmdsSnap.exists()) {
      const val = cmdsSnap.val();
      for (const [k, v] of Object.entries(val)) {
        cmds.push({ id: k, ...(v as any) });
      }
      // remove commands once returned to device
      await admin.database().ref(`commands/${deviceId}`).remove();
    }

    return NextResponse.json({ ok: true, commands: cmds });
  } catch (err: any) {
    console.error("/api/device/commands error:", err);
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
