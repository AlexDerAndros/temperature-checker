import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-btn text-slate-400 py-6 mt-auto border-t border-slate-800">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-center sm:text-left">
        
        <div>
          <p className="font-bold text-white">TempCheck</p>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Alle Rechte vorbehalten.</p>
        </div>

        <div className="flex gap-x-6 text-xs font-medium">
          <Link 
            href="/Impressum" 
            className="hover:text-white transition-colors duration-200 py-1"
          >
            Impressum
          </Link>
          <Link 
            href="/Datenschutz" 
            className="hover:text-white transition-colors duration-200 py-1"
          >
            Datenschutz
          </Link>
        </div>

      </div>
    </footer>
  );
}