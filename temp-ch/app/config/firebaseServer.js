import admin from 'firebase-admin';

let configOption;

// Cloud/Frontend Firestore Configuration
configOption = {
  projectId: process.env.ADMIN_FIREBASE_PID, 
  clientEmail: process.env.ADMIN_FIREBASE_CEMAIL,
  privateKey: process.env.FIREBASE_PRIVATEKEY?.replace(/\\n/g, '\n') 
};

if (!admin.apps.length) {
  try {
    // WICHTIG: Das Objekt MUSS in admin.credential.cert() eingepackt werden!
    admin.initializeApp({ 
      credential: admin.credential.cert(configOption) 
    });
    console.log("Firebase Admin Initialized ✅");
  } catch (error) {
    console.error("Firebase Admin Error ❌:", error.stack);
  }
}

export const dbAdmin = admin.firestore();