"use client";

import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
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

//Context Dark/Light
import { useDarkLight } from "./contexts/DarkLightContext";


function HomeLandingPage() {
  return (
    <>
    </>
  )
}

function Homepage() {
  const{container, containerHover} = useDarkLight();
  const[temperatures, setTemperatures] = useState<any[]>([]);
  const[difference, setDifference] = useState(0);
  const[typeDifference, setTypeDifference] = useState("");
  const[loading, setLoading] = useState(false);
 
  const[current, setCurrent] = useState("bg-normal");

  const dark = { bg:"bg-bgDark",  color:"text-white" };
  const light = {bg:"bg-white", color:"text-primary"};
  
  const transition = "transition-alternate duration-300";
  const padding = "px-1 md:px-30 lg:px-60";
  const hover = `hover:scale-[1.02] hover:shadow-md active:scale-[1.02] md:active:scale-[1.01] active:shadow-md ${containerHover} cursor-pointer`;

 
  
 

  useEffect(() => {
  const getTemperatures = onSnapshot(collection(db, 'temperatures'), (snapshot) => {
    // 1. Daten auslesen
    const datas = snapshot.docs.map(doc => {
      const data = doc.data();
      const rawDate = new Date(data.timestamp || Date.now());
      
      return {
        ...data,
        id: doc.id,
        timestamp: data.timestamp || Date.now(),
        onlyTime: rawDate.toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' })
      };
    });

    if (datas.length > 0) {
      // 2. Sortieren, damit das neueste Element ganz hinten steht
      datas.sort((a, b) => a.timestamp - b.timestamp);

      // 3. Den neuesten Eintrag greifen (letzter Index im sortierten Array)
      const newestEntry = datas[datas.length - 1];

      // 4. Differenz fehlerfrei berechnen
      const timePast = newestEntry.timestamp; // Das ist jetzt eine saubere Zahl (ms)
      const timeNow = Date.now(); // Aktuelle Zeit in ms
      
      const difference = timeNow - timePast;
      const difInMin = Math.floor(difference / 1000 / 60);

      // 5. States setzen
      if(difInMin >= 0) {
        if(difInMin >= 1440) {
          const newNumber = Math.floor(difInMin / 60/24);
          setDifference(newNumber);
          if( newNumber == 1 ){
            setTypeDifference("Tag");
          } else {
            setTypeDifference("Tagen");
          }
        } else if(difInMin <= 1440 && difInMin >= 60) {
          const newNumber = Math.floor(difInMin / 60);
          setDifference(newNumber);
          if( newNumber == 1 ){
            setTypeDifference("Stunde");
          } else {
            setTypeDifference("Stunden");
          }
        }
        else {
          setDifference(difInMin);
           if( difInMin == 1 ){
            setTypeDifference("Minute");
          } else {
            setTypeDifference("Minuten");
          } 
        }
      }
    }

    setLoading(false);
    setTemperatures(datas);
  });

  return () => getTemperatures();
}, []);
  
  return (
   <>
   
     
      <h2 className={`w-screen mt-5 flex flex-col items-center justify-center font-bold  ${transition} hover:text-secondary `}>Temperatur Dashboard von Zimmer 1</h2>
  <main className={`w-screen flex flex-col md:flex-row md:gap-5  justify-center items-center gap-5 my-7 px-5 md:px-10 lg:px-20 `}>

  {/* Haupt-Card */}
  <section className={` flex items-center justify-center flex-col gap-3 ${container} rounded-xl ${transition} ${hover} w-4/5 md:h-150 md:w-screen p-5`} >
     <h3 className={`font-bold ${transition}  `}>Liniendiagram der letzten 2 Stunden <span className="text-sm text-tertiary">(zuletzt aktualisiert vor {difference} {typeDifference})</span> </h3>
     <ResponsiveContainer width="100%" height={300}>
        <LineChart data={temperatures}>
         <XAxis dataKey="onlyTime" 
                        label={{ value: "Uhrzeit", position: "insideBottom", offset: -5 }}
          />
          <YAxis dataKey="temperature" label={{ value: "Temperatur in °C", position: "insideLeft", offset: 1, angle: 270 }} />
          <Tooltip 
            labelFormatter={(value, items) => {
                 // Zeigt im Tooltip beim Hovern das volle Datum anstelle von nur der Uhrzeit
                 const item = items[0]?.payload;
                   return item ? `Zeitpunkt: ${item.datePlusTime}` : value;
                     }}
               contentStyle={{ color: "black" }}
             />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
         </LineChart> 
     </ResponsiveContainer>
  </section>

  {/* Sidebar / rechte Cards */}
  <aside  className="w-4/5 md:w-1/2 md:h-150 flex flex-row md:flex-col justify-between h-full md:gap-y-3">
    <section className={`${container} w-[45%] md:w-auto rounded-xl p-5 flex gap-6 flex-col justify-center items-center ${transition} ${hover} `} >
      <h3 className={`font-bold `}>Warnungen in den letzen 24 Stunden
      
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


export default function Home() {
  const[loggedIn, setLoggedIN] = useState(true);
  
  if(loggedIn == true) {
    return <Homepage/>
  } else {
    return <HomeLandingPage/>;
  }
  
}
