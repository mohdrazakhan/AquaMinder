// scripts/seedDevicesRTDB.js
// Usage:
//   NODE_ENV=development NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://...-default-rtdb.firebaseio.com" node scripts/seedDevicesRTDB.js [count]
// Example:
//   node scripts/seedDevicesRTDB.js 3

const admin = require("firebase-admin");

const path = require("path");
const fs = require("fs");

// Load .env.local manually so running this script with `node` picks up env vars
// (Next.js does not automatically load .env.local for plain node scripts).
const dotenvPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(dotenvPath)) {
  const envContents = fs.readFileSync(dotenvPath, "utf8");
  envContents.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // remove surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  });
}

const serviceAccountPath = path.join(__dirname, "..", "serviceAccount.json");
if (!fs.existsSync(serviceAccountPath)) {
  console.error("serviceAccount.json not found at project root. Create it or set FIREBASE_SERVICE_ACCOUNT env var.");
  process.exit(1);
}
const serviceAccount = require(serviceAccountPath);

const DB_URL =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  process.env.FIREBASE_DATABASE_URL;
if (!DB_URL) {
  console.error("Set NEXT_PUBLIC_FIREBASE_DATABASE_URL in .env.local or env.");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: DB_URL,
  });
}
const db = admin.database();

async function main() {
  const countArg = parseInt(process.argv[2] || "1", 10);
  const count = isNaN(countArg) ? 1 : Math.max(1, countArg);

  // configure prefix and starting numeric part length
  const prefix = "AQ-B";
  const padLen = 2; // AQ-B01, AQ-B02

  // fetch existing device keys and find highest index for prefix
  const snap = await db.ref("devices").once("value");
  const val = snap.val() || {};
  let max = 0;
  Object.keys(val).forEach((k) => {
    if (!k.startsWith(prefix)) return;
    const num = parseInt(k.slice(prefix.length), 10);
    if (!isNaN(num) && num > max) max = num;
  });

  // default password for seeds
  const defaultPassword = process.env.SEED_DEFAULT_PASSWORD || "aqua1234";

  // use bcrypt from dynamic import to avoid build-time issues
  const bcrypt = (await import("bcrypt")).default;

  for (let i = 1; i <= count; i++) {
    const idx = max + i;
    const idSuffix = String(idx).padStart(padLen, "0");
    const deviceId = `${prefix}${idSuffix}`;
    const hash = await bcrypt.hash(defaultPassword, 10);

    const payload = {
      createdAt: Date.now(),
      deviceId,
      factoryDefaultPasswordHash: hash,
      passwordHash: hash,
      verified: false,
      meta: { model: "basic" },
    };

    await db.ref(`devices/${deviceId}`).set(payload);
    console.log("Seeded:", deviceId);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
