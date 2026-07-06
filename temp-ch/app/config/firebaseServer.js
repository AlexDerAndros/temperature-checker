import admin from 'firebase-admin';
import { createRequire } from 'module';

// Das erlaubt uns, eine JSON-Datei im ES-Modul-Modus sauber zu importieren
const require = createRequire(import.meta.url);
let serviceAccount;
try {
  serviceAccount = require('serviceAccountKey.json');
} catch(e) {
  serviceAccount = require('../configAdmin/serviceAccountKey.json');
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // Firebase zieht sich jetzt alle IDs und Keys perfekt formatiert aus der Datei
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized ✅");
  } catch (error) {
    console.error("Firebase Admin Error ❌:", error.stack);
  }
}

export const dbAdmin = admin.firestore();