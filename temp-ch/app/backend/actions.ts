'use server';

import { dbAdmin } from "../config/firebaseServer";

export const addUser = async (email: string | null): Promise<{ success: boolean; error?: string }> => {
  // Wenn keine E-Mail übergeben wurde, brechen wir direkt ab
  if (!email) {
    console.warn("addUser abgebrochen: Keine E-Mail-Adresse übergeben.");
    return { success: false, error: "Keine E-Mail vorhanden" };
  }

  try {
    // Wir nutzen die E-Mail als Dokument-ID (alternativ UID, je nach deiner Struktur)
    const userRef = dbAdmin.collection("users").doc(email);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        email: email,
        role: "user", // Standardrolle
        createdAt: new Date().toISOString()
      });
      console.log("Neuer User in Firestore angelegt:", email);
    } else {
      console.log("User existiert bereits, Daten bleiben erhalten:", email);
    }

    return { success: true };
  } catch (e) {
    console.error("Fehler beim Hinzufügen des Users in Firestore:", e);
    return { success: false, error: "Datenbankfehler" };
  }
};