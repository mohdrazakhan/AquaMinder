// src/app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import crypto from "crypto";
import bcrypt from "bcrypt";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "dev-secret";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }
    // Ensure server-side secrets are present
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
      console.error("Admin credentials not configured (ADMIN_EMAIL or ADMIN_PASSWORD_HASH missing)");
      return NextResponse.json({ error: "internal" }, { status: 500 });
    }

    // Timing-safe email comparison: compare SHA-256 digests so buffers are fixed-length
    const submittedEmailHash = crypto.createHash("sha256").update(String(email)).digest();
    const adminEmailHash = crypto.createHash("sha256").update(String(ADMIN_EMAIL)).digest();
    let emailMatches = false;
    try {
      emailMatches = crypto.timingSafeEqual(submittedEmailHash, adminEmailHash);
    } catch (e) {
      // timingSafeEqual throws if buffers have different lengths; hashes are equal-length so
      // this should not happen, but handle defensively.
      console.error("email timingSafeEqual error", e);
      emailMatches = false;
    }

    // Use bcrypt to compare submitted password with stored hash (async)
    let passwordMatches = false;
    try {
      passwordMatches = await bcrypt.compare(String(password), String(ADMIN_PASSWORD_HASH));
    } catch (e) {
      console.error("bcrypt compare error", e);
      passwordMatches = false;
    }

    if (!emailMatches || !passwordMatches) {
      return NextResponse.json({ error: "invalid" }, { status: 401 });
    }

    const token = jwt.sign({ role: "admin", email }, JWT_SECRET, { expiresIn: "8h" });

    // set HttpOnly cookie
    const cookie = serialize("admin_token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
    });

    const res = NextResponse.json({ ok: true });
    res.headers.append("Set-Cookie", cookie);
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
