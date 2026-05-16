"use client";

import { useEffect, useState } from "react";
import { Moon, SunMoon } from "lucide-react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  const dark = { bg:"bg-bgDark",  color:"text-white" };
  const light = {bg:"bg-white", color:"text-primary"};
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);

     document.body.classList.add(dark.bg, dark.color);
     document.body.classList.remove(light.bg, light.color);
  }, []);

  const toggle = () => {
    const newDM = !darkMode;
    setDarkMode(newDM);
    localStorage.setItem("darkMode", newDM.toString());
    document.body.classList.toggle("dark", newDM);
  };

  return (
    <p
      className="h-10 flex items-center p-2 cursor-pointer rounded-full transition hover:bg-container hover:text-secondary"
      onClick={toggle}
    >
      {darkMode ? <Moon size={25} /> : <SunMoon size={25} />}
    </p>
  );
}
