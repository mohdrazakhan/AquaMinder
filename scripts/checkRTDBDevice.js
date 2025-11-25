// scripts/checkRTDBDevice.js
// Usage: node scripts/checkRTDBDevice.js TEST-DEV-001
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const svcPath = path.join(process.cwd(), 'serviceAccount.json');
if (!fs.existsSync(svcPath)) {
  console.error('serviceAccount.json not found in project root. Place it there.');
  process.exit(1);
}
const svc = require(svcPath);

const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL || 'https://aquaminder-6335d-default-rtdb.firebaseio.com';

admin.initializeApp({
  credential: admin.credential.cert(svc),
  databaseURL: DB_URL
});

const db = admin.database();

async function run(deviceId){
  console.log('Checking device:', deviceId);
  const ref = db.ref(`devices/${deviceId}`);
  const snap = await ref.once('value');
  console.log('RTDB /devices/' + deviceId + ' exists:', snap.exists());
  if (snap.exists()) {
    console.log('Value at /devices/' + deviceId + ':');
    console.log(JSON.stringify(snap.val(), null, 2));
  } else {
    console.log('No data at /devices/' + deviceId + '.');
    // show list of top-level children under /devices for quick check
    const top = await db.ref('devices').once('value');
    console.log('Top-level devices keys (first 50):', Object.keys(top.val() || {}).slice(0,50));
  }
  process.exit(0);
}

const id = process.argv[2];
if (!id) { console.error('Usage: node scripts/checkRTDBDevice.js <deviceId>'); process.exit(1); }
run(id).catch(e=>{ console.error(e); process.exit(2); });
