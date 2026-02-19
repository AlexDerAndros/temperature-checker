"use client";
import "./globals.css";
import { useEffect, useState } from "react";
import {MapPin, Moon, SunMoon} from 'lucide-react';
import { welcomeText } from "./texte";

export default function Home() {

  const[darkMode, setDarkMode] = useState(false);
  const[container, setContainer] = useState('');
  const[containerHover, setContainerHover] = useState('');
  const dark = { bg:"bg-bgDark",  color:"text-white" };
  const light = {bg:"bg-white", color:"text-primary"};

  
  
  const[current, setCurrent] = useState("bg-normal");
  const transition = "transition-alternate duration-300";
  const padding = "px-15 md:px-30 lg:px-60";

  const pressDarkMode = () => {
    const newDM = !darkMode;
    setDarkMode(newDM);
    localStorage.setItem("darkMode", newDM.toString());
    if(newDM === true) {
      setContainer('bg-containerDark');
      setContainerHover('hover:bg-containerDarkHover');
      document.body.classList.add(dark.bg, dark.color);
      document.body.classList.remove(light.bg, light.color);
    } else {
      setContainer('bg-container');
      setContainerHover('hover:bg-containerHover');
      document.body.classList.remove(dark.bg, dark.color);
      document.body.classList.add(light.bg, light.color);
    }
  }

  useEffect(() => {
     const checkLightDarkMode = () => {
      if(localStorage.getItem("darkMode") === "true") {
        setContainer('bg-containerDark');
        setContainerHover('hover:bg-containerDarkHover');
        setDarkMode(true);
        document.body.classList.add(dark.bg, dark.color);
        document.body.classList.remove(light.bg, light.color);
      } else {
        setContainer('bg-container');
        setContainerHover('hover:bg-containerHover');
        setDarkMode(false);
        document.body.classList.remove(dark.bg, dark.color);
        document.body.classList.add(light.bg, light.color);
      }
     }
     checkLightDarkMode();
  }, []);
  
  return (
   <>
     <header className={`w-full h-10 flex items-center justify-between md:justify-around ${padding} `}>
       <h2 className={`font-bold w-1/4 hover:text-secondary ${transition} `}>
         <span className="text-cold">T</span>emp<span className="text-warm">C</span>heck
       </h2>
       <div className="flex row justify-around text-lg w-[60%] ">
         {/*Aktueller Raum mit Raumauswahl */}
         <p className={`flex row  gap-1 h-10 items-center p-1 rounded-full 
           cursor-pointer ${transition} hover:bg-container hover:text-secondary`}>
            <MapPin size={20}/> <span>Zimmer 1</span></p>
         {/*Aktuelle Temperatur des Raumes in Celsius mit Zustand */}
         <p className={`flex row  gap-1 h-10 items-center p-1 rounded-full 
           cursor-pointer ${transition} hover:bg-container hover:text-secondary`}>
           <span className={`w-5 h-5 ${current} rounded-full aniTemp`}></span>
           <span>24°C</span>
         </p>
         {/*Dark/Light Mode */}
         <p className={`h-10 flex items-center  p-2 cursor-pointer rounded-full ${transition} hover:bg-container
         hover:text-secondary `}
              onClick={pressDarkMode}>
           {darkMode === true ? (
            <Moon size={25} />
           ): (
            <SunMoon size={25}/>
           )} 
         </p>
       </div>
     </header>
     <h2 className={`font-bold w-full mt-5 flex flex-col items-center justify-center ${transition} hover:text-secondary `}>Übersicht über alle Daten </h2>
   <main className={`w-full grid grid-cols-3 gap-7  mt-5 h-[700px] p-7 md:p-11 md:gap-12`}>
  
  {/* Linker großer Bereich */}
  <section className={`col-span-2 cursor-pointer ${container} rounded-xl ${transition} hover:scale-[1.05] hover:shadow-md
  ${containerHover}`}>
    
  </section>

  {/* Rechte Spalte */}
  <aside className={`grid grid-rows-2 gap-7 md:gap-12`}>
    <section className={`${container} rounded-xl ${transition} hover:scale-[1.05] cursor-pointer ${containerHover}`}>

    </section>
    <section className={`${container} rounded-xl  ${transition} hover:scale-[1.05] cursor-pointer ${containerHover}`}></section>
  </aside>

</main>
    </> 
  );
}
