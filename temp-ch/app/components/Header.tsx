"use client";
import { useState, useRef, useEffect } from "react";
import { useDarkLight } from "@/contexts/DarkLightContext";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, SunMoon, SettingsIcon, X, LogOut, User, ChevronRight } from "lucide-react";
import { GithubIcon } from "@/icons/GitHubIcon";
import Link from "next/link";
import { gsap } from "gsap";

const iconStyle = "h-10 w-10 flex items-center justify-center p-2 cursor-pointer rounded-full transition hover:bg-containerHover hover:text-secondary";

export default function Header() {
  let header = <div></div>;
  const { user, SignOut } = useAuth();
  const { darkMode, toggleTheme, container, containerHover } = useDarkLight();
  
  const [settingTab, setSettingTab] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // GSAP Animation für Einblenden
  useEffect(() => {
    if (settingTab && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [settingTab]);

  // Funktion zum animierten Schließen des Menüs
  const animateClose = (callback?: () => void) => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        y: -10,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setSettingTab(false);
          if (callback) callback();
        }
      });
    } else {
      setSettingTab(false);
      if (callback) callback();
    }
  };

  // Outside-Click Listener (Schließen bei Klick außerhalb)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingTab &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        animateClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingTab]);

  const handleSettingTab = () => {
    if (settingTab) {
      animateClose();
    } else {
      setSettingTab(true);
    }
  };

  let niceName = "";
  if (user && user.email) {
    const email = user.email;
    const username = email.split('@')[0]; 
    niceName = username
      .replace(/[._]/g, ' ') 
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  if (user) {
    header = (
      <>
        <h5 className="font-bold text-lg md:text-xl">TempCheck</h5>
        
        <div className="relative">
          <button 
            ref={buttonRef}
            onClick={handleSettingTab} 
            className={iconStyle} 
            aria-label="Einstellungen öffnen"
          >
            <SettingsIcon />
          </button>

          {settingTab && (
            <div 
              ref={menuRef}
              className={`absolute right-0 top-12 w-64 p-4 rounded-2xl ${container} shadow-2xl border border-gray-200 dark:border-gray-800 z-50 flex flex-col gap-3`}
            >
              {/* Header im Popover */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-semibold tracking-wider text-secondary uppercase">Übersicht</span>
                <button onClick={() => animateClose()} className="p-1 rounded-full hover:bg-containerHover transition">
                  <X size={18} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 py-1">
                <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-primary dark:text-white">
                  <User size={20} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs text-secondary">Eingeloggt als</span>
                  <span className="font-bold text-sm truncate">{niceName}</span>
                </div>
              </div>

              {/* Liste mit Optionen inklusive "Mehr..." / Einstellungen-Seite */}
              <ul className="flex flex-col gap-1 pt-1">
                <li>
                  <Link 
                    href="/einstellungen" 
                    onClick={() => animateClose()}
                    className={`flex items-center justify-between py-2 px-3 rounded-xl ${containerHover} text-sm font-medium transition`}
                  >
                    <span>Mehr... (Einstellungen)</span>
                    <ChevronRight size={16} className="text-secondary" />
                  </Link>
                </li>
              </ul>

              {/* Ausloggen-Button */}
              <button 
                onClick={() => animateClose(() => SignOut())}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 mt-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
              >
                <LogOut size={16} />
                Ausloggen
              </button>
            </div>
          )}
        </div>
      </>
    );
  } else {
    header = (
      <>
        <h5 className="font-bold text-lg md:text-xl">Willkommen bei TempCheck!</h5>
        <a href="https://github.com/AlexDerAndros/temperature-checker" className={iconStyle} target="_blank" rel="noopener noreferrer">
          <GithubIcon />
        </a>
      </>
    );
  }

  return (
    <header className="w-full flex flex-row items-center justify-between px-5 py-3">
      <span className={iconStyle} onClick={toggleTheme} aria-label="Theme umschalten">
        {darkMode ? <Moon size={25} /> : <SunMoon size={25} />}
      </span>  
      {header}
    </header>
  );
}