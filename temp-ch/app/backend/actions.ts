'use server';

import { dbAdmin } from "../config/firebaseServer";

//Login
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
        createdAt: new Date().toISOString(), 
        highestTemp: 30,
        lowestTemp: 0
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

//Sensoren
export const addSensor = async (room: string, sensorId: string, email: string) => {
    try {
        if (!room || !room.trim() || !sensorId || !sensorId.trim() || !email || !email.trim()) {
            return { success: false, error: "Alle Felder müssen ausgefüllt werden." };
        }

        const sensorRef = dbAdmin.collection("sensors").doc(sensorId.trim());
        const doc = await sensorRef.get();

        if (doc.exists) {
            return { success: false, error: "Sensor-ID existiert bereits." };
        }

        // Erzeugt einen sauberen lesbaren Zeitstempel in deutscher Ortszeit (MEZ/MESZ)
        const nowInGermany = new Intl.DateTimeFormat('de-DE', {
            timeZone: 'Europe/Berlin',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(new Date());

        await sensorRef.set({
            room: room.trim(), 
            sensorId: sensorId.trim(),
            user: email.trim(),
            active: true,
            lastSeen: nowInGermany // Direkt lesbar als "TT.MM.JJJJ, HH:MM:SS"
        });

        return { success: true };
    } catch (e) {
        console.error("Fehler beim Hinzufügen des Sensors:", e);
        return { success: false, error: "Datenbankfehler" };
    }
};

export const deleteSensor = async(sensorId: string) => {
  try {
    await dbAdmin.collection("sensors").doc(sensorId).delete();
    return { success: true };
  }catch(e) {
    return { success: false, error: "Datenbankfehler" };
  }
}

//Einstellungen aktualisieren

export const updateSettings = async (email: string, highTemp: string | number, lowTemp: string | number) => {
  try {
    const userRef = dbAdmin.collection("users").doc(email);
    
    const newSettings = {
        highestTemp: Number(highTemp),
        lowestTemp: Number(lowTemp)
    };

    await userRef.update(newSettings);
    
    console.log(`Einstellungen für ${email} erfolgreich aktualisiert.`);
    return { success: true };
    
  } catch (e) {
    console.error("Fehler beim Aktualisieren der Einstellungen:", e);
    return { success: false, error: e };
  }
};


//Aktualisieren und Hinzufügen eines Raumes
export const setRoom = async (name: string, user: string, sensors: number, warnings: number) => {
    try {
        if ( !name.trim() || !user || !user.trim()) {
            return { success: false, error: "Raumname und User dürfen nicht leer sein." };
        }

        const trimmedName = name.trim();
        const roomRef = dbAdmin.collection("rooms").doc(trimmedName);
        const docSnap = await roomRef.get();

        if (!docSnap.exists) {
            console.log(`Erstelle neuen Raum: ${trimmedName}`);
        } else {
            console.log(`Raum ${trimmedName} existiert bereits – wird aktualisiert (Update).`);
        }
        await roomRef.set({
            name: trimmedName,
            user: user.trim(),
            sensors: Number(sensors) || 0,
            warnings: Number(warnings) || 0,
        }, { merge: true });

        return { success: true };

    } catch (e) {
        console.error("Fehler beim Speichern/Aktualisieren des Raumes:", e);
        return { success: false, error: "Datenbankfehler beim Speichern des Raumes" };
    }
};
//Raum löschen
export const deleteRoom = async (name: string) => {
  try {
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { success: false, error: "Ungültiger Raumname." };
    }    
    const roomRef = dbAdmin.collection("rooms").doc(trimmedName);
    const docSnap = await roomRef.get();

    if (!docSnap.exists) {
      return { success: false, error: "Dokument existiert nicht mehr." };
    } 

    await roomRef.delete();
    return { success: true };

  } catch (e) {
    console.error("Fehler beim Löschen des Raumes:", e);
    return { success: false, error: e };
  }
};

