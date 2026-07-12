"use client";

import { useEffect, useState } from "react";
// Icons
import {MapPin, Moon, SunMoon} from 'lucide-react';
import { welcomeText } from "./texte";
// GSAP
import { gsap } from "gsap/gsap-core";
// Charts
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";
//Routing

// Database and Authentification
import { getData, addData } from "./backend/actions";
import {db} from './config/firebaseClient';
import { onSnapshot, collection } from "firebase/firestore";



export default function Home() {
  function HomeLG() {
  
  }

  const[darkMode, setDarkMode] = useState(false);
  const[temperatures, setTemperatures] = useState<any[]>([]);
  const[loading, setLoading] = useState(false);
  const[container, setContainer] = useState('');
  const[containerHover, setContainerHover] = useState('');
  const[current, setCurrent] = useState("bg-normal");

  const dark = { bg:"bg-bgDark",  color:"text-white" };
  const light = {bg:"bg-white", color:"text-primary"};
  
  const transition = "transition-alternate duration-300";
  const padding = "px-1 md:px-30 lg:px-60";
  const hover = `hover:scale-[1.02] hover:shadow-md active:scale-[1.02] md:active:scale-[1.01] active:shadow-md ${containerHover} cursor-pointer`;

  const pressDarkMode = () => {
    const newDM = !darkMode;
    setDarkMode(newDM);
    localStorage.setItem("darkMode", newDM.toString());
    if(newDM === true) {
      setContainer('bg-containerDark');
      setContainerHover('hover:bg-containerDarkHover active:bg-containerDarkHover');
      document.body.classList.add(dark.bg, dark.color);
      document.body.classList.remove(light.bg, light.color);
    } else {
      setContainer('bg-container');
      setContainerHover('hover:bg-containerHover active:bg-containerHover');
      document.body.classList.remove(dark.bg, dark.color);
      document.body.classList.add(light.bg, light.color);
    }
  }

  

  
  

  useEffect(() => {
     const checkLightDarkMode = () => {
      if(localStorage.getItem("darkMode") === "true") {
        setContainer('bg-containerDark ');
        setContainerHover('hover:bg-containerDarkHover active:bg-containerDarkHover');
        setDarkMode(true);
        document.body.classList.add(dark.bg, dark.color);
        document.body.classList.remove(light.bg, light.color);
      } else {
        setContainer('bg-container');
        setContainerHover('hover:bg-containerHover active:bg-containerHover');
        setDarkMode(false);
        document.body.classList.remove(dark.bg, dark.color);
        document.body.classList.add(light.bg, light.color);
      }
     }
     checkLightDarkMode();
   
    
  }, []);

  useEffect(() => {
     const getTemperatures = onSnapshot(collection(db, 'temperatures'), (snapshot) => {
      const datas = snapshot.docs.map(doc => ({
        ...doc.data(),
      }));
      
      setLoading(false);
      setTemperatures(datas);
     
    });
    return () => getTemperatures();
    
  },[])
  
  return (
   <>
   
     
      <h2 className={`w-screen mt-5 flex flex-col items-center justify-center font-bold  ${transition} hover:text-secondary `}>Temperatur Dashboard von Zimmer 1</h2>
  <main className={`w-screen flex flex-col md:flex-row md:gap-5  justify-center items-center gap-5 my-7 px-5 md:px-10 lg:px-20 `}>

  {/* Haupt-Card */}
  <section className={` flex items-center justify-center flex-col gap-3 ${container} rounded-xl ${transition} ${hover} w-4/5 md:h-150 md:w-screen p-5`} >
     <h3 className={`font-bold ${transition}  `}>Liniendiagram der letzten 2 Stunden <span className="text-sm text-tertiary">(zuletzt aktualisiert vor 5 Minuten)</span> </h3>
     <ResponsiveContainer width="100%" height={300}>
        <LineChart data={temperatures}>
          <XAxis dataKey="time" label={{ value: "Uhrzeit", position: "insideBottom", offset: -5}}/>
          <YAxis dataKey="Temperatur" label={{value: "Temperature in °C", position: "insideLeft", offset: 1, angle:270}}/>
          <Tooltip contentStyle={{color: "black"}}/>
          <Line type="monotone" dataKey="Temperatur" stroke="#8884d8" />
         </LineChart> 
     </ResponsiveContainer>
  </section>

  {/* Sidebar / rechte Cards */}
  <aside  className="w-4/5 md:w-1/2 md:h-150 flex flex-row md:flex-col justify-between h-full md:gap-y-3">
    <section className={`${container} w-[45%] md:w-auto rounded-xl p-5 flex gap-6 flex-col justify-center items-center ${transition} ${hover} `} >
      <h3 className={`font-bold `}>Warnungen in den letzen 24 Stunden
      
      {temperatures.map((item, index) => 
      <span key={index}>
        {item.temperature} <br/>
      </span>)}
      </h3>
      <div className="text-2xl flex flex-row items-center gap-2">
        <span>0</span> 
        {/*Ändern */}
         <div className={`w-5 h-5 md:w-7 md:h-7 bg-normal  rounded-full aniTemp`}>
          </div>
      </div>
    </section>
     <section className={`${container} w-[45%] md:w-auto rounded-xl p-5 flex gap-6 flex-col justify-center items-center ${transition} ${hover} `} >
      <h3 className={`font-bold `}>Aktive Sensoren </h3>
      <div className="text-2xl flex flex-row items-center gap-2">
        <span>0</span> 
        {/*Ändern */}
         <div className={`w-5 h-5 md:w-7 md:h-7 bg-warm  rounded-full aniTemp`}>
          </div>
      </div>
    </section>
  </aside>

</main>
    </> 
  );
}
