import express from 'express';
import { dbAdmin } from "../config/firebaseServer.js";
import { time } from 'console';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

interface TemperatureData {
    device: string;
    temperature: number;
    humidity: number;
}


const addTempData = async (temp: number, hum: number) => {
    try {
        const timestampMs = Date.now(); 
        
        const docRef = await dbAdmin.collection("temperatures").add({
            temperature: temp,
            humidity: hum, 
            timestamp: timestampMs, 
            datePlusTime: new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })
        });
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Firebase Fehler:", e);
        return { success: false, error: "Fehler beim Speichern in Firebase" };
    }
};

app.post('/api/temperatureData', async (req: express.Request, res: express.Response) => {
    try {
        const data = req.body as TemperatureData;
        
        console.log(`\n--- Neue Daten empfangen von: ${data.device} ---`);
        console.log(`Temperatur: ${data.temperature}°C`);
        console.log(`Luftfeuchtigkeit: ${data.humidity}%`);
        
        
        const dbResult = await addTempData(data.temperature, data.humidity);

        if (dbResult.success) {
            res.status(200).json({ 
                success: true, 
                message: `Daten erfolgreich empfangen und in Firebase gespeichert! ID: ${dbResult.id}` 
            });
        } else {
            res.status(500).json({ success: false, message: "Konnte Daten nicht in DB schreiben." });
        }

    } catch (error) {
        console.error("Fehler beim Verarbeiten der Daten:", error);
        res.status(500).json({ success: false, message: "Server-Fehler" });
    }
});

app.listen(PORT , '0.0.0.0', () => {
    console.log(`Backend-Server läuft live auf ${PORT}`);
});
