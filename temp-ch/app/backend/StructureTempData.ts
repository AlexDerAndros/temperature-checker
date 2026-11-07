import express from 'express';
import { dbAdmin } from "../config/firebaseServer.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());


interface TemperatureData {
    sensor_id: string;
    device: string;
    temperature: number;
    humidity: number;
}


const addTempData = async (sensorId: string, temp: number, hum: number) => {
    try {
        const timestampMs = Date.now(); 
        
        // Erzeugt den formatierten deutschen Zeitstring für MEZ/MESZ
        const germanTime = new Intl.DateTimeFormat('de-DE', {
            timeZone: 'Europe/Berlin',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(new Date());
        
        const sensorRef = dbAdmin.collection("sensors").doc(sensorId);

        // 1. Zuerst das Sensor-Dokument abrufen, um den zugehörigen User zu finden
        const sensorDoc = await sensorRef.get();
        
        let assignedUser = "unknown";
        if (sensorDoc.exists) {
            const sensorData = sensorDoc.data();
            assignedUser = sensorData?.user || "unknown";
        } else {
            console.warn(`Warnung: Keine Zuordnung für Sensor-ID ${sensorId} gefunden.`);
        }

        // 2. Sensor Status & lastSeen aktualisieren
        await sensorRef.set({
            lastSeen: germanTime, // Aktualisiert sich bei jeder Messung auf die aktuelle deutsche Zeit
            active: true // Wenn er Daten sendet, ist er aktiv
        }, { merge: true });
         
        // 3. Temperatur-Messwert mitsamt dem ermittelten User speichern
        const docRef = await dbAdmin.collection("temperatures").add({
            sensorId: sensorId,
            temperature: temp,
            humidity: hum, 
            timestamp: timestampMs, 
            datePlusTime: germanTime,
            user: assignedUser
        });

        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Firebase Fehler:", e);
        return { success: false, error: "Fehler beim Speichern in Firebase" };
    }
};


app.post('/api/temperatureData', async (req: express.Request, res: express.Response) => {
    try {
        const incomingSecret = req.headers['x-device-secret'];
        const validSecret = process.env.DEVICE_SECRET;

        if (!incomingSecret || incomingSecret !== validSecret) {
            console.warn("Unautorisierter Zugriffsversuch abgelehnt.");
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized: Ungültiges oder fehlendes Device Secret" 
            });
        }

        // 2. Daten verarbeiten
        const data = req.body as TemperatureData;
        
        console.log(`\n--- Neue Daten empfangen von Sensor: ${data.sensor_id} (${data.device}) ---`);
        console.log(`Temperatur: ${data.temperature}°C`);
        console.log(`Luftfeuchtigkeit: ${data.humidity}%`);
        
        const dbResult = await addTempData(data.sensor_id, data.temperature, data.humidity);

        if (dbResult.success) {
            res.status(200).json({ 
                success: true, 
                message: `Daten erfolgreich empfangen und in Firebase gespeichert! ID: ${dbResult.id}` 
            }); //[cite: 2]
        } else {
            res.status(500).json({ success: false, message: "Konnte Daten nicht in DB schreiben." });
        }

    } catch (error) {
        console.error("Fehler beim Verarbeiten der Daten:", error);
        res.status(500).json({ success: false, message: "Server-Fehler" });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend-Server läuft live auf ${PORT}`);
});