"use client";

import { useDarkLight } from "@/contexts/DarkLightContext";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, SunMoon } from "lucide-react";
import { GithubIcon } from "@/icons/GitHubIcon";

export default function Header() {
  let header = <div></div>;
  const {user} = useAuth();
  const { darkMode, toggleTheme } = useDarkLight();
  
  if(user) {
      header= 
      <div>
        Wilkommen {user.email}!
      </div>;
  } else {
      header= 
      <>
        <h3 className="font-bold"> Willkommen bei TempCheck!</h3>
        <a href="https://github.com/AlexDerAndros/temperature-checker"
        className="h-10 w-10 flex items-center justify-center p-2 cursor-pointer rounded-full transition hover:bg-containerHover hover:text-secondary">
          <GithubIcon/>
        </a>
      </>;
  }
  return (
    <header className="w-full flex flex-row items-center justify-between px-5">
     <span
       className="h-10 w-10 flex items-center justify-center p-2 cursor-pointer rounded-full transition hover:bg-containerHover hover:text-secondary"
       onClick={toggleTheme} 
     >
       {darkMode ? <Moon size={25} /> : <SunMoon size={25} />}
      </span>  
      {header}
    </header>
  );
}