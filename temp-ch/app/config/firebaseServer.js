import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let configOption;

// BEDINGUNG: Wenn der Private Key in den Umgebungsvariablen existiert (Vercel)
if (process.env.FIREBASE_PRIVATEKEY) {
  
  configOption = {
    projectId: process.env.ADMIN_FIREBASE_PID, 
    clientEmail: process.env.ADMIN_FIREBASE_CEMAIL,
    // Verhindert Probleme mit umgebrochenen Zeilen (\n) im Key
    privateKey: process.env.FIREBASE_PRIVATEKEY.replace(/\\n/g, '\n') 
  };
  
} else {
  
  // Cloud/Render oder Lokal: Wir laden die JSON-Datei
  let serviceAccount;
  try {
    const path = '../../serviceAccountKey.json';
    serviceAccount = require(path); 
  } catch(e) {
    const path = '../configAdmin/serviceAccountKey.json';
    serviceAccount = require(path);
  }
  
  // Für admin.credential.cert() nutzen wir das geladene JSON-Objekt
  configOption = admin.credential.cert(serviceAccount);
}

// EINMALIGE INITIALISIERUNG (Gilt jetzt für beide Wege!)
if (!admin.apps.length) {
  try {
    // Firebase Admin akzeptiert entweder ein Config-Objekt ODER admin.credential.cert() direkt!
    if (process.env.FIREBASE_PRIVATEKEY) {
      admin.initializeApp({ credential: admin.credential.cert(configOption) });
    } else {
      admin.initializeApp({ credential: configOption });
    }
    console.log("Firebase Admin Initialized ✅");
  } catch (error) {
    console.error("Firebase Admin Error ❌:", error.stack);
  }
}

export const dbAdmin = admin.firestore();