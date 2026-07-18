"use client";

import { useEffect, useState } from "react";
import { Moon, SunMoon } from "lucide-react";
import Cookies from "js-cookie";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  const dark = { bg: "bg-bgDark", color: "text-white" };
  const light = { bg: "bg-white", color: "text-primary" };

  // Helper-Funktion, um Codeduplizierung zu vermeiden
  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.body.classList.add(dark.bg, dark.color);
      document.body.classList.remove(light.bg, light.color);
    } else {
      document.body.classList.remove(dark.bg, dark.color);
      document.body.classList.add(light.bg, light.color);
    }
  };

  useEffect(() => {
    const saved = Cookies.get("darkMode") === "true";
    setDarkMode(saved);
    applyTheme(saved); // Wendet das geladene Theme an
  }, []);

  const toggle = () => {
    const newDM = !darkMode;
    setDarkMode(newDM);
    Cookies.set("darkMode", newDM.toString(), {expires: 7});
    applyTheme(newDM); // Aktualisiert die Klassen beim Klick sofort!
  };

  return (
    <div
      className="h-10 flex items-center p-2 cursor-pointer rounded-full transition hover:bg-containerHover hover:text-secondary"
      onClick={toggle}
    >
      {darkMode ? <Moon size={25} /> : <SunMoon size={25} />}
    </div>
  );
}