"use client";
import "./globals.css";
import { useState } from "react";
import {MapPin, Moon, SunMoon} from 'lucide-react';

export default function Home() {
  /*Dark-Light Mode */
  const[lightMode, setLightMode] = useState(false);
  const[current, setCurrent] = useState("bg-normal");
  const transition = "transition-alternate duration-300";
  
  return (
   <>
     <header className={`w-full h-10 flex items-center justify-between px-15 md:px-30 lg:px-60  `}>
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
         <p className={`h-10 flex items-center  p-2 cursor-pointer rounded-full ${transition} hover:bg-container `}
              onClick={() => setLightMode(!lightMode)}>
           {lightMode === true ? (
            <SunMoon size={25} />
           ): (
            <Moon size={25}/>
           )}
         </p>
       </div>
     </header>
    </> 
  );
}
