// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    // placeholder: accept any non-empty email/password for now
    if (!email || !password) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }

    // In production: verify credentials, create session cookie or return token
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
