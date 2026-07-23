"use client";

import { useDarkLight } from "@/contexts/DarkLightContext";
import { Moon, SunMoon } from "lucide-react";

export default function DarkModeToggle() {
  // Wir holen uns alles direkt aus dem Provider
  const { darkMode, toggleTheme } = useDarkLight();

  return (
    <div
      className="h-10 w-10 flex items-center justify-center p-2 cursor-pointer rounded-full transition hover:bg-containerHover hover:text-secondary"
      onClick={toggleTheme} 
    >
      {darkMode ? <Moon size={25} /> : <SunMoon size={25} />}
    </div>
  );
}