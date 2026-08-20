import Link from 'next/link';
import { BackButton } from '@/components/Components';

export default function Impressum() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 ">
     <Link href='/'>
      <BackButton/>
    </Link>   
      <h1 className="text-3xl font-bold my-6">Impressum</h1>
       
      <section className="space-y-6 text-sm md:text-base leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">Angaben gemäß § 5 DDG</h2>
          <p>TempCheck GmbH (i.G.)</p>
          <p>Musterstraße 123</p>
          <p>12345 Musterstadt</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Vertreten durch</h2>
          <p>Max Mustermann</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
          <p>Telefon: +49 (0) 123 456789</p>
          <p>E-Mail: support@tempcheck.de</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Umsatzsteuer-ID</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
          <p>DE 123 456 789</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Redaktionell verantwortlich</h2>
          <p>Max Mustermann</p>
          <p>Musterstraße 123</p>
          <p>12345 Musterstadt</p>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-semibold mb-2">EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a 
              href="https://ec.europa.eu/consumers/odr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-500 hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            .<br />
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
        </div>
      </section>
    </div>
  );
}