// src/lib/adminAuth.ts
// Admin auth helper: verifies admin JWT from cookie (recommended) or falls back
// to a simple header secret for quick local testing.
// NOTE: For production use a proper admin/auth provider and rotate secrets.

import jwt from "jsonwebtoken";

export function verifyAdminTokenFromHeaderOrCookie(req: Request) {
  // 1) Try JWT cookie named `admin_token` signed with ADMIN_JWT_SECRET
  const jwtSecret = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_JWT || "dev-secret";
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  if (match && match[1]) {
    const token = match[1];
    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      // decoded may contain role/email
      if (decoded && decoded.role === "admin") return { admin: true, payload: decoded };
    } catch (err) {
      // invalid token - continue to fallback
      console.warn("Invalid admin_token JWT", err);
    }
  }

  // 2) Fallback: simple secret via Authorization header (Bearer <ADMIN_SECRET>)
  const header = req.headers.get("authorization") || "";
  const bearer = header.replace(/^Bearer\s+/i, "");
  const adminSecret = process.env.ADMIN_SECRET; // optional
  if (adminSecret && bearer === adminSecret) return { admin: true };

  return null;
}
