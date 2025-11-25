// scripts/seedDeviceRTDB.js
// Run: node scripts/seedDeviceRTDB.js
// Creates a test device at /devices/<deviceId> in your RTDB with a bcrypt factory password hash.

const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const svcPath = path.join(process.cwd(), 'serviceAccount.json');
if (!fs.existsSync(svcPath)) {
  console.error('serviceAccount.json missing in project root. Place your Firebase service account JSON as serviceAccount.json');
  process.exit(1);
}

const svc = require(svcPath);
admin.initializeApp({
  credential: admin.credential.cert(svc),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://aquaminder-6335d-default-rtdb.firebaseio.com'
});

const rtdb = admin.database();

async function run() {
  const deviceId = 'AQ-B01';         // change to your device id format
  const factoryPassword = 'AquaMinder';   // default printed password on the device
  const factoryHash = await bcrypt.hash(factoryPassword, 10);

  const deviceRef = rtdb.ref(`devices/${deviceId}`);
  await deviceRef.set({
    deviceId,
    factoryDefaultPasswordHash: factoryHash,
    passwordHash: factoryHash,      // initially same
    ownerUid: null,
    verified: false,
    meta: { model: 'AquaMinder Basic' },
    createdAt: Date.now()
  });

  console.log('Seeded RTDB device:', deviceId);
  console.log('Factory password (plain):', factoryPassword);
  console.log('Now you can test /api/device/verify with deviceId and defaultPassword.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(2); });
