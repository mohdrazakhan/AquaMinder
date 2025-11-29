import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, newPassword, email, phone } = body;
    if (!token || !newPassword || !email) return NextResponse.json({ error: "invalid" }, { status: 400 });

    // Validate token format (alphanumeric only)
    if (!/^[a-zA-Z0-9_-]+$/.test(token)) {
      return NextResponse.json({ error: "invalid_token" }, { status: 400 });
    }

    const admin = getAdmin();
    const tokenSnap = await admin.database().ref(`deviceRegisterTokens/${token}`).get();
    if (!tokenSnap.exists()) return NextResponse.json({ error: "invalid_token" }, { status: 400 });

    const { deviceId } = tokenSnap.val();

    // create Firebase Auth user for the owner (email+password)
    const auth = admin.auth();
    let userRecord;
    try {
      userRecord = await auth.createUser({ email, password: newPassword });
    } catch (e: any) {
      // If user exists, sign them in by finding user
      if (e.code === "auth/email-already-exists") {
        userRecord = await auth.getUserByEmail(email);
      } else {
        throw e;
      }
    }

    // link device with owner UID
    await admin.database().ref(`devices/${deviceId}`).update({
      ownerUid: userRecord.uid,
      verified: true,
      passwordHash: await bcrypt.hash(newPassword, 10),
      userEmail: email,
      userPhone: phone || null,
      verifiedAt: Date.now(),
    });

    // remove token
    await admin.database().ref(`deviceRegisterTokens/${token}`).remove();

    return NextResponse.json({ ok: true, ownerUid: userRecord.uid });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
