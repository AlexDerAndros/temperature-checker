import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-btn text-slate-400 py-6 border-t border-slate-800 mt-auto">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        
        <div>
          <p className="font-bold text-white">TempCheck</p>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Alle Rechte vorbehalten.</p>
        </div>

        <div className="flex gap-x-6 text-xs font-medium">
          <Link 
            href="/Impressum" 
            className="hover:text-white transition-colors duration-200"
          >
            Impressum
          </Link>
          <Link 
            href="/Datenschutz" 
            className="hover:text-white transition-colors duration-200"
          >
            Datenschutz
          </Link>
        </div>

      </div>
    </footer>
  );
}