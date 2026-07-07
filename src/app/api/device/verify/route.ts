// server route for device verify
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";

function maskEmail(email: string) {
  if (!email || email === "N/A") return "N/A";
  const parts = email.split("@");
  if (parts.length !== 2) return "N/A";
  const [local, domain] = parts;
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local.substring(0, 2)}${"*".repeat(local.length - 2)}@${domain}`;
}

function maskName(name: string) {
  if (!name || name === "N/A") return "N/A";
  if (name.length <= 2) return `${name[0]}*`;
  return `${name.substring(0, 2)}${"*".repeat(name.length - 2)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId } = body;
    if (!deviceId) return NextResponse.json({ error: "invalid" }, { status: 400 });

    const admin = getAdmin();
    const snap = await admin.database().ref(`tanks/${deviceId}`).get();
    if (!snap.exists()) return NextResponse.json({ error: "not_found", message: "Device not found" }, { status: 404 });

    const data = snap.val();
    
    // If device already claimed/verified, return masked info
    if (data.verified) {
      let ownerName = "N/A";
      let ownerEmail = data.userEmail || "N/A";

      // Try to fetch user from Firebase Auth to get displayName
      if (data.ownerUid) {
        try {
          const userRecord = await admin.auth().getUser(data.ownerUid);
          ownerEmail = userRecord.email || ownerEmail;
          ownerName = userRecord.displayName || ownerName;
        } catch (e) {
          console.error("Error fetching user details", e);
        }
      }

      return NextResponse.json({
        ok: true,
        isVerified: true,
        deviceInfo: {
          name: maskName(ownerName),
          email: maskEmail(ownerEmail),
          connectedAt: data.verifiedAt || null,
          createdAt: data.createdAt || null
        }
      });
    }

    // If not verified, generate registration token
    // Create a temporary token (simple random string)
    const token = Math.random().toString(36).slice(2, 10);
    // store token under /deviceTokens/<token> -> deviceId with TTL (createdAt)
    await admin.database().ref(`deviceRegisterTokens/${token}`).set({
      deviceId,
      createdAt: Date.now(),
    });

    return NextResponse.json({ 
      ok: true, 
      isVerified: false, 
      token,
      deviceInfo: {
        name: "N/A",
        email: "N/A",
        connectedAt: null,
        createdAt: data.createdAt || null
      }
    });
  } catch (err) {
    console.error("verify error", err);
    return NextResponse.json({ error: "internal", message: "Internal server error" }, { status: 500 });
  }
}
