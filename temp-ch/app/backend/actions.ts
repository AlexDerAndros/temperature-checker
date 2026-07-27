'use server';

import { dbAdmin } from "../config/firebaseServer";

export const addUser = async (uid: string, email: string | null) => {
  try {
    // Nutzen der UID als Dokument-ID!
    await dbAdmin.collection("users").doc(uid).set({
      email: email,
      role: "user", 
      highestTemp: 0,
      lowestTemp: 0
    }, { merge: true }); // { merge: true } verhindert, dass vorhandene Daten überschrieben werden

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Fehler beim Anlegen des Nutzers" };
  }
}