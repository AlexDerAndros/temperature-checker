"use client";

import { useDarkLight } from "@/contexts/DarkLightContext";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, SunMoon , SettingsIcon} from "lucide-react";
import { GithubIcon } from "@/icons/GitHubIcon";
import Link from "next/link";


const iconStyle =" h-10 w-10 flex items-center justify-center p-2 cursor-pointer rounded-full transition hover:bg-containerHover hover:text-secondary";

export default function Header() {
  let header = <div></div>;
  const {user} = useAuth();
  const { darkMode, toggleTheme } = useDarkLight();
  
  if(user) {
      header= 
      <>
      <h4>
        Wilkommen {user?.email}!
      </h4>
      <Link href="/einstellungen" className={iconStyle}>
         <SettingsIcon/>
      </Link>
      </>;
  } else {
      header= 
      <>
        <h5 className="font-bold text-lg md:text-xl"> Willkommen bei TempCheck!</h5>
        <a href="https://github.com/AlexDerAndros/temperature-checker"
        className={iconStyle}>
          <GithubIcon/>
        </a>
      </>;
  }
  return (
    <header className="w-full flex flex-row items-center justify-between px-5">
     <span
       className={iconStyle}
       onClick={toggleTheme} 
     >
       {darkMode ? <Moon size={25} /> : <SunMoon size={25} />}
      </span>  
      {header}
    </header>
  );
}