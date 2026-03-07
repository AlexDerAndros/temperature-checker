import admin from 'firebase-admin';

// Wir fassen die Initialisierung in einen Block
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.ADMIN_FIREBASE_PID,
        clientEmail: process.env.ADMIN_FIREBASE_CEMAIL,
        // Der Replace-Fix für Vercel/Next.js Zeilenumbrüche
        privateKey: process.env.FIREBASE_PRIVATEKEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log("Firebase Admin Initialized ✅");
  } catch (error: any) {
    console.error("Firebase Admin Error ❌:", error.stack);
  }
}

// Wir exportieren die Instanz direkt von der admin-Klasse
// Das stellt sicher, dass wir immer die initialisierte App nutzen
export const dbAdmin = admin.firestore();