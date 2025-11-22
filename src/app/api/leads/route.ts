import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("📩 New lead received:");
    console.log("Name:", body.name);
    console.log("Email:", body.email);
    console.log("Message:", body.message);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
