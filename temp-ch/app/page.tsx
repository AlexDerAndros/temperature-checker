"use client";
import { useEffect, useState } from "react";
//Texte
import { WhatText } from "./texte";
// GSAP
import { gsap } from "gsap/gsap-core";
// Charts
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts";
//Routing
import  Link  from "next/link";
// Database and Authentification
import {db} from './config/firebaseClient';
import { onSnapshot, collection } from "firebase/firestore";
import { getOwnSensors } from "./backend/getFrontend";

//Components Import
import { Login, Register } from "./components/Login_Register";
import { Button } from "./components/Components";
//Contexts
import { useDarkLight } from "./contexts/DarkLightContext";
import { useAuth } from "./contexts/AuthContext";
import { Activity, AlertTriangle, Cpu, TrendingUp } from "lucide-react";


type HomepageProps = {
  container: string;
  hover: string;
  transition:string;
};

type ViewState = "landing" | "login" | "register";

export function HomeLandingPage({ container, hover, transition }: HomepageProps) {
  const [view, setView] = useState<ViewState>("landing");
  const padding = "p-6 md:p-8 rounded-md";
  const [temp, setTemp] = useState<number>(22);//Definition eines Number States

  // get-Funktion, die mehrere Variable basierend auf t als Nummerparameter wiedergibt,
  //if, else Statement wo zu verschiedenen Temperaturen verschiedene Farben sowie verschiedene Labels ausgewählt werden
  const getTempColor = (t: number) => {
    if (t < 18) return { text: "text-cold", bg: "bg-cold", label: "Kühl" };
    if (t <= 25) return { text: "text-normal", bg: "bg-normal", label: "Optimal" };
    return { text: "text-warm", bg: "bg-warm", label: "Kritisch" };
  };

  const status = getTempColor(temp); //Rückgabewerte wird als Object an die Konstante Status übergeben

  if (view === "login") {
    return <Login onClick={() => setView("landing")} />;
  } else if (view === "register") {
    return <Register onClick={() => setView("landing")} />;
  } else {
   return (
    <div className="w-full flex justify-center items-center flex-col mb-5">
      
      <main className="w-4/5 flex flex-col gap-y-7 mt-7">
        <section className={`${padding} ${container} ${hover} ${transition} max-w-4xl mx-auto my-8`}>
      <h3 className="font-bold text-2xl md:text-3xl text-center mb-6  ">
        Was ist TempCheck?
      </h3>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Interaktives 2D-Thermometer / Widget */}
        <div className={`w-full  ${transition} hover:scale-105  md:w-1/2 flex flex-col items-center justify-center p-6 bg-btn text-white rounded-xl `}>
          
          {/* Live Temp Display */}
          <div className="text-center mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider ">
              Live-Simulation
            </span>
            <div className={`text-4xl font-black ${status.text} transition-colors duration-200`}>
              {temp.toFixed(1)} °C {/**Nummer Temp wird auf eine Nachkommastelle gerundet */}
            </div>
            <span className={`inline-block px-2.5 py-0.5 mt-1 text-xs font-bold rounded-full  ${status.bg} transition-colors duration-200`}>
              {status.label} {/**Object wird aufgerufen  */}
            </span>
          </div>

          {/* Slider & Skala */}
          <div className="w-full  space-y-2">
            {/**Schieberegler wird mit weiteren Attributen deklariert  */}
            <input 
              type="range" 
              min="10" 
              max="35" 
              step="0.5"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
              <span>10°C</span> 
              <span>22°C</span>
              <span>35°C</span>
            </div>
          </div>
        </div>

        {/* Beschreibungstext */}
        <div className="w-full md:w-1/2">
          <p className=" leading-relaxed text-base md:text-lg">
            {WhatText}
          </p>
        </div>

      </div>
    </section>

        <section className={`${padding} ${container} ${hover} ${transition}  max-w-4xl mx-auto my-8`}>
          <h3 className="font-bold text-center mb-6">Wozu brauchst du TempCheck?</h3>
          <div className={`w-full flex flex-col md:flex-row gap-8 items-center justify-between`} >
           <img 
             src="/images/WhyTempCheck.png" 
             alt="TempCheck Kontrast" 
             className={`w-full md:w-1/2 rounded-lg object-cover hover:scale-105 ${transition}`} 
           />
           <div className="w-full md:w-1/2 leading-relaxed text-lg">
             <ul className="space-y-3 text-sm md:text-base font-medium">
                <li className="flex items-center gap-x-3">
                <span className="text-xl">⚡</span>
               <span>Echtzeit-Überwachung rund um die Uhr</span>
              </li>
              <li className="flex items-center gap-x-3">
               <span className="text-xl">🔔</span>
               <span>Sofortige Warnung bei kritischer Temperatur</span>
             </li>
            <li className="flex items-center gap-x-3">
              <span className="text-xl">📊</span>
              <span>Automatische Daten-Historie & Berichte</span>
            </li>
           </ul>
           </div>
          </div>
        </section>
        
        <section className="text-center font-bold flex flex-col items-center gap-2">
          <Button 
            type="button"
            text="Logge dich jetzt ein!" 
            onClick={() => setView("login")}
            addStyle="bg-cold  hover:opacity-80"
          />

          <span className="text-tertiary text-sm">oder</span>

          <Button 
            type="button"
            text="Registriere dich!" 
            onClick={() => setView("register")}
            addStyle="bg-cold hover:opacity-80"
          />
        </section>
      </main>
    </div>
   );
  }
}


 function Homepage({ container, hover, transition }: HomepageProps) {
  const [ownSensors, setOwnSensors] = useState<any[]>([]);
  const [temperatures, setTemperatures] = useState<any[]>([]);
  const [difference, setDifference] = useState(0);
  const [typeDifference, setTypeDifference] = useState("");
  const [loading, setLoading] = useState(true);
  const [sensorColor, setSensorColor] = useState("");
  const { user } = useAuth();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Temperatur-Daten in Echtzeit über Firestore Snapshot laden
  useEffect(() => {
    const getTemperatures = onSnapshot(collection(db, 'temperatures'), (snapshot) => {
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
        datas.sort((a, b) => a.timestamp - b.timestamp);
        const newestEntry = datas[datas.length - 1];

        const timePast = newestEntry.timestamp;
        const timeNow = Date.now();
        
        const diffMs = timeNow - timePast;
        const difInMin = Math.floor(diffMs / 1000 / 60);

        if (difInMin >= 0) {
          if (difInMin >= 1440) {
            const newNumber = Math.floor(difInMin / 60 / 24);
            setDifference(newNumber);
            setTypeDifference(newNumber === 1 ? "Tag" : "Tagen");
          } else if (difInMin < 1440 && difInMin >= 60) {
            const newNumber = Math.floor(difInMin / 60);
            setDifference(newNumber);
            setTypeDifference(newNumber === 1 ? "Stunde" : "Stunden");
          } else {
            setDifference(difInMin);
            setTypeDifference(difInMin === 1 ? "Minute" : "Minuten");
          }
        }
      }

      setTemperatures(datas);
      setLoading(false);
    }, (error) => {
      console.error("Fehler beim Laden der Temperaturen:", error);
      setLoading(false);
    });

    return () => getTemperatures();
  }, []);

  // Sensoren des Users laden
  useEffect(() => {
    const initData = async () => {
      if (user && user.email) {
        try {
          const ownRes = await getOwnSensors(user.email);
          let newArray: any[] = [];
          if (ownRes.success) newArray = ownRes.ownSensors;
          
          if (newArray.length <= 0) {
            setSensorColor("bg-warm");
          } else {
            setSensorColor("bg-normal");
          }
          setOwnSensors(newArray);
        } catch (error) {
          console.error("Fehler beim Laden der Sensoren:", error);
        }
      }
    };
     
    initData();
  }, [user]);
 
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col items-center px-4 md:px-8 py-6 overflow-x-hidden">
      
      {/* Dashboard Header */}
      <div className="w-full max-w-5xl flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold mb-2">
          <Activity size={14} />
          <span>Live-Überwachung</span>
        </div>
        <h2 className={`font-extrabold text-2xl md:text-3xl tracking-tight ${transition} hover:text-secondary`}>
          Temperatur Dashboard von Zimmer 1
        </h2>
        <p className="text-sm text-secondary mt-1">Echtzeit-Daten und Sensorstatus im Überblick</p>
      </div>

      {/* Haupt-Container */}
      <main className="w-full max-w-5xl flex flex-col gap-6 items-center">
        
        {/* Ladezustand oder Haupt-Card mit Diagramm */}
        {loading === true ? (
          <div className={`w-full h-96 flex flex-col items-center justify-center gap-3 rounded-3xl ${container} border border-secondary/10 shadow-sm`}>
            <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
            <p className="text-secondary text-sm animate-pulse">Lade Status und Messwerte...</p>
          </div>
        ) : (
          <Link 
            href="/uebersicht" 
            className={`w-full flex flex-col gap-4 ${container} rounded-3xl border border-secondary/10 ${transition} ${hover} p-6 md:p-8 shadow-sm group cursor-pointer`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-secondary/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <TrendingUp size={18} />
                </div>
                <h3 className={`font-bold text-base md:text-lg ${transition}`}>
                  Liniendiagramm der letzten 2 Stunden
                </h3>
              </div>
              {mounted && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary/10 text-secondary w-fit">
                  Aktualisiert vor {difference} {typeDifference}
                </span>
              )}
            </div>

            {/* Recharts Diagramm */}
            <div className="w-full h-[280px] md:h-[340px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatures} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="onlyTime" 
                    stroke="currentColor" 
                    opacity={0.6}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="currentColor" 
                    opacity={0.6}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    domain={['auto', 'auto']}
                  />
               <Tooltip 
    labelFormatter={(value, items) => {
        const item = items[0]?.payload;
        return item ? `Zeitpunkt: ${item.datePlusTime}` : value;
    }}
    formatter={(value: any) => [`${value} °C`, "Temperatur"]}
    contentStyle={{ 
        backgroundColor: "var(--color-container)", 
        borderRadius: "1rem", 
        border: "1px solid rgba(107, 114, 128, 0.2)",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        color: "var(--color-primary)"
    }}
    itemStyle={{
        color: "var(--color-primary)",
        fontWeight: "600"
    }}
/>
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: "#6366f1" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Link>
        )}

        {/* Sidebar / Untere Info-Cards (Volle Breite im Grid) */}
        <aside className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Warnungen Card */}
          <Link href="/warnungen" className="w-full">
            <section className={`${container} w-full rounded-3xl border border-secondary/10 p-6 flex items-center justify-between ${transition} ${hover} shadow-sm group cursor-pointer`}>
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-secondary font-medium">System Status</span>
                  <h3 className="font-bold text-lg">Warnungen</h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-extrabold">0</span>
                <div className="w-4 h-4 bg-normal rounded-full aniTemp shadow-md shadow-emerald-500/50"></div>
              </div>
            </section>
          </Link>

          {/* Aktive Sensoren Card */}
          <Link href="/sensoren" className="w-full">
            <section className={`${container} w-full rounded-3xl border border-secondary/10 p-6 flex items-center justify-between ${transition} ${hover} shadow-sm group cursor-pointer`}>
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                  <Cpu size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-secondary font-medium">Hardware</span>
                  <h3 className="font-bold text-lg">Aktive Sensoren</h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-extrabold">{ownSensors?.length ?? 0}</span>
                <div className={`w-4 h-4 ${sensorColor} rounded-full aniTemp shadow-md`}></div>
              </div>
            </section>
          </Link>

        </aside>

      </main>
    </div> 
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
   } 
  else {
    return <HomeLandingPage container={container} hover={hover} transition={transition} />;
  }
  
}
