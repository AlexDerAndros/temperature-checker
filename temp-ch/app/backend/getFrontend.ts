'use server';

import { dbAdmin } from "../config/firebaseServer";

//Admin Überprüfung
export const getRole = async(email:string): Promise<string> => {
    try {
        const snapshot = await dbAdmin.collection("users").doc(email).get()
        const user = snapshot.data();
        return user?.role || "Error";
    } catch(e) {
        console.error(e);
        return "Error";
    }
}


//eigene und alle Sensoren bekommen
export const getOwnSensors = async (email: string) => {
    try {
        const snapshot = await dbAdmin.collection("sensors")
            .where("user", "==", email)
            .get();
        const ownSensors = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, ownSensors };
    } catch (e) {
        console.error("Fehler beim Abrufen der Sensoren:", e);
        return { success: false, error: "Datenbankfehler", ownSensors: [] };
    }
};

export const getAllSensors = async () => {
    try {
        const snapshot = await dbAdmin.collection("sensors").get();
        const allSensors = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, allSensors };
    } catch (e) {
        console.error("Fehler beim Abrufen der Sensoren:", e);
        return { success: false, error: "Datenbankfehler", allSensors: [] };
    }
};