import Link from "next/link";
import { BackButton } from "../components/Components";

export default function Datenschutz() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Link href="/">
        <BackButton />
      </Link>

      <h1 className="text-3xl font-bold mt-12 mb-8">Datenschutzerklärung</h1>

      <div className="space-y-6 text-sm md:text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Datenschutz auf einen Blick</h2>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Datenerfassung auf unserer Website</h2>
          <h3 className="font-medium text-lg mt-3 mb-1">Wer ist verantwortlich für die Datenerfassung?</h3>
          <p >
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
          </p>

          <h3 className="font-medium text-lg mt-3 mb-1">Wie erfassen wir Ihre Daten?</h3>
          <p >
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z. B. bei der Registrierung per E-Mail oder Google-Login). Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
          </p>
        </section>

        {/* Neuer Abschnitt für deinen Tech-Stack */}
        <section>
          <h2 className="text-xl font-semibold mb-2">3. Verarbeitung durch externe Dienste & Hardware</h2>
          
          <h3 className="font-medium text-lg mt-3 mb-1">Firebase (Authentifizierung & Datenbank)</h3>
          <p>
            Für die Benutzerauthentifizierung (Anmeldung/Registrierung) und die Speicherung von Anwendungsdaten nutzen wir Google Firebase. Ihre Daten werden verschlüsselt auf den Servern von Google verarbeitet.
          </p>

          <h3 className="font-medium text-lg mt-3 mb-1">Render (Backend-Hosting)</h3>
          <p>
            Unser Backend wird auf der Cloud-Plattform Render gehostet. Render verarbeitet API-Anfragen und sorgt für die sichere Ausführung unserer Server-Logik.
          </p>

          <h3 className="font-medium text-lg mt-3 mb-1">ESP32-Mikrocontroller (Sensorik & Hardware)</h3>
          <p >
            Zur Erfassung von Temperatur- und Messdaten kommen ESP32-Mikrocontroller zum Einsatz. Diese übermitteln ausschließlich technische Sensorwerte an unser Backend. Es werden keine personenbezogenen Daten auf den Geräten gespeichert.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Ihre Rechte</h2>
          <p >
            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
          </p>
        </section>
      </div>
    </div>
  );
}