"use client";
import { useEffect, useState } from "react";
//Texte
import { WhatText, WhyText } from "./texte";
// GSAP
import { gsap } from "gsap/gsap-core";
// Charts
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";
//Routing

// Database and Authentification
import {db} from './config/firebaseClient';
import { onSnapshot, collection } from "firebase/firestore";

//Components Import
import { Login, Register } from "./components/Login_Register";
import { Button } from "./components/Components";
//Contexts
import { useDarkLight } from "./contexts/DarkLightContext";
import { useAuth } from "./contexts/AuthContext";




type HomepageProps = {
  container: string;
  hover: string;
  transition:string;
};

type ViewState = "landing" | "login" | "register";

export function HomeLandingPage({ container, hover, transition }: HomepageProps) {
  const [view, setView] = useState<ViewState>("landing");
  const padding = "p-5 rounded-md";

  if (view === "login") {
    return <Login onClick={() => setView("landing")} />;
  } else if (view === "register") {
    return <Register onClick={() => setView("landing")} />;
  } else {
   return (
    <div className="w-screen flex justify-center items-center flex-col mb-5">
      <span className="font-bold mt-5 text-2xl md:text-3xl lg:text-4xl">
        Willkommen bei TempCheck!
      </span>

      <main className="w-4/5 flex flex-col gap-y-7 mt-7">
        <section className={`${padding} ${container} ${hover} ${transition}`}>
          <h3 className="font-bold text-center mb-1 md:mb-2">Was ist TempCheck?</h3>
          <p>{WhatText}</p>
        </section>

        <section className={`${padding} ${container} ${hover} ${transition}`}>
          <h3 className="font-bold text-center mb-1 md:mb-2">Wozu brauchst du TempCheck?</h3>
          <p>{WhyText}</p>
        </section>
        
        <section className="text-center font-bold flex flex-col items-center gap-2">
          <Button 
            type="button"
            text="Logge dich jetzt ein!" 
            onClick={() => setView("login")}
            addStyle="bg-cold text-white hover:opacity-90"
          />

          <span className="text-tertiary text-sm">oder</span>

          <Button 
            type="button"
            text="Registriere dich!" 
            onClick={() => setView("register")}
            addStyle="border border-cold text-cold bg-transparent hover:bg-cold hover:text-white"
          />
        </section>
      </main>
    </div>
   );
  }
}

function Homepage({container, hover, transition}:HomepageProps) {
  
  const[temperatures, setTemperatures] = useState<any[]>([]);
  const[difference, setDifference] = useState(0);
  const[typeDifference, setTypeDifference] = useState("");
  const[loading, setLoading] = useState(false);
  const {user, SignOut} = useAuth();

  const[current, setCurrent] = useState("bg-normal");

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
  <h2 className={`w-screen mt-5 flex flex-col items-center justify-center font-bold  ${transition} hover:text-secondary `}>
   {user?.email} Temperatur Dashboard von Zimmer 1
  </h2>
  <main className={`w-screen flex flex-col md:flex-row md:gap-5  justify-center items-center gap-5 my-7 px-5 md:px-10 lg:px-20 `}>
   <Button text="Ausloggen" onClick={SignOut}/>
  {/* Haupt-Card */}
  {loading == true ? (
  <div className={`min-h-screen flex items-center justify-center ${container}`}>
        <p className="animate-pulse">Lade Status...</p>
    </div>): (
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
  )}

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
  const {user, loading} = useAuth();
  const{container, containerHover} = useDarkLight();
  const hover = `hover:scale-[1.02] hover:shadow-md active:scale-[1.02] md:active:scale-[1.01] active:shadow-md ${containerHover} cursor-pointer`;
  const transition = "transition-alternate duration-300";
  
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${container}`}>
        <p className="animate-pulse">Lade Status...</p>
      </div>
    );
  } else if(user) {
    return <Homepage container={container} hover={hover} transition={transition} />
  } else {
    return <HomeLandingPage container={container} hover={hover} transition={transition} />;
  }
  
}
