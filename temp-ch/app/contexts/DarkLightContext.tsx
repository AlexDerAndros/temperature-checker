"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

type DarkLightType = {
  container: string;
  containerHover: string;
  darkMode: boolean;
  toggleTheme: () => void;
};

const DarkLightContext = createContext<DarkLightType | undefined>(undefined);

export function DarkLightProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = Cookies.get("darkMode") === "true";
    setDarkMode(isDark);
    
     if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDM = !darkMode;
    setDarkMode(nextDM);
    Cookies.set("darkMode", nextDM.toString(), { expires: 7, path: "/" });

    if (nextDM) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Dynamische Klassen je nach Modus
  const container = darkMode ? "bg-containerDark" : "bg-container";
  const containerHover = darkMode
    ? "hover:bg-containerDarkHover active:bg-containerDarkHover"
    : "hover:bg-containerHover active:bg-containerHover";

  return (
    <DarkLightContext.Provider value={{ container, containerHover, darkMode, toggleTheme }}>
      {children}
    </DarkLightContext.Provider>
  );
}

// Custom Hook für einfachen Import
export function useDarkLight() {
  const context = useContext(DarkLightContext);
  if (!context) {
    throw new Error("useDarkLight muss innerhalb von DarkLightProvider verwendet werden");
  }
  return context;
}