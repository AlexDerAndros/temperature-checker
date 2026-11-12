"use client";
import Link from "next/link";
import { BackButton } from "@/components/Components";
import { useEffect, useState, useRef } from "react";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkLight } from "@/contexts/DarkLightContext";
import { db } from "@/config/firebaseClient";
import { getOwnSensors } from "@/backend/getFrontend";
import gsap from "gsap";
import { Thermometer, Droplets, Clock, Activity, Cpu } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const {container, containerHover} = useDarkLight();
  const [temperatures, setTemperatures] = useState<any[]>([]);
  const [ownSensors, setOwnSensors] = useState<any[]>([]);
  const [difference, setDifference] = useState(0);
  const [typeDifference, setTypeDifference] = useState("");
  const [loading, setLoading] = useState(true);


  // Refs für GSAP-Animationen
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // 1. Temperaturen laden
  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, 'temperatures'),
      where("user", "==", user.email) 
    );
 
    const unsubscribe = onSnapshot(q, (snapshot) => {
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
        datas.sort((a: any, b: any) => b.timestamp - a.timestamp); // Neueste zuerst für die Karten-Ansicht

        const newestEntry = datas[0]; // Da absteigend sortiert, ist der erste der neueste
        const timePast = newestEntry.timestamp; 
        const timeNow = Date.now(); 
        
        const difference = timeNow - timePast;
        const difInMin = Math.floor(difference / 1000 / 60);
 
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
      } else {
        setDifference(0);
        setTypeDifference("");
      }
 
      setTemperatures(datas);
      setLoading(false);
    }, (error: any) => {
      console.error("Fehler beim Laden der Temperaturen:", error);
      setLoading(false);
    });
 
    return () => unsubscribe();
  }, [user]);

  // 2. Sensoren des Users laden
  useEffect(() => {
    const initData = async () => {
      if (user && user.email) {
        try {
          const ownRes = await getOwnSensors(user.email);
          let newArray: any[] = [];
          if (ownRes.success) newArray = ownRes.ownSensors;
          setOwnSensors(newArray);
        } catch (error) {
          console.error("Fehler beim Laden der Sensoren:", error);
        }
      }
    };
     
    initData();
  }, [user]);

  // 3. GSAP Entrance Animationen sobald Daten da sind und geladen wurde
  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      if (headerRef.current) {
        tl.fromTo(headerRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
      }
      if (statsRef.current) {
        tl.fromTo(statsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");
      }
      if (cardsRef.current) {
        tl.fromTo(
          cardsRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          "-=0.2"
        );
      }
    }
  }, [loading]);

  return (
    <div className="w-full min-h-screen px-4 md:px-12 py-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mb-6">
        <Link href="/">
          <BackButton />
        </Link>
      </div>

      {loading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <p className="animate-pulse text-secondary font-medium">Lade Dashboard-Daten...</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl flex flex-col gap-8">
          
          {/* Header & Stats Info-Box */}
          <div ref={headerRef} className="flex flex-col items-center text-center gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight">Dashboard</h2>
            <p className="text-secondary text-sm">Übersicht deiner aktiven Sensoren und Messwerte</p>
          </div>

          {/* Aufgewertete Stats-Bar (Sensor-ID, Raum, Letztes Update) */}
          <div 
            ref={statsRef}
            className={`w-full grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-3xl  border border-secondary/10 shadow-sm ${container}`}
          >
            {/* Sensor ID Box */}
            <div className="flex items-center gap-4 p-3 rounded-2xl ">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                <Cpu size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-secondary font-medium">Sensor-ID</span>
                <span className="font-bold text-sm truncate max-w-[180px]">
                  {ownSensors.length > 0 
                    ? ownSensors.map((item) => item.sensorId).join(", ") 
                    : "Kein Sensor"}
                </span>
              </div>
            </div>

            {/* Raum Box */}
            <div className="flex items-center gap-4 p-3 rounded-2xl ">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Activity size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-secondary font-medium">Raum</span>
                <span className="font-bold text-sm text-tertiary">Noch nicht verfügbar</span>
              </div>
            </div>

            {/* Letzte Aktualisierung Box */}
            <div className="flex items-center gap-4 p-3 rounded-2xl ">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <Clock size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-secondary font-medium">Letztes Update</span>
                <span className="font-bold text-sm">
                  {difference > 0 || typeDifference ? `vor ${difference} ${typeDifference}` : "Gerade eben"}
                </span>
              </div>
            </div>
          </div>

          {/* Sektion für Temperaturkarten */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold px-1">Messwerte-Historie</h3>
            
            {temperatures.length === 0 ? (
              <div className="w-full p-12 text-center rounded-3xl bg-[var(--color-container)] dark:bg-[var(--color-containerDark)] border border-secondary/10">
                <p className="text-secondary">Es sind noch keine Temperaturdaten vorhanden.</p>
              </div>
            ) : (
              <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {temperatures.map((temp, index) => (
                  <div 
                    key={index}
                    className={`flex flex-col justify-between p-6 rounded-3xl  transition-all duration-300 border border-secondary/10 shadow-sm group hover:-translate-y-1 ${container} ${containerHover} `}
                  >
                    {/* Karten Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                          <Thermometer size={22} />
                        </div>
                        <div>
                          <span className="text-xs text-secondary font-medium">Messwert</span>
                          <h4 className="font-extrabold text-lg">{temp.temperature} °C</h4>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">
                        {temp.onlyTime}
                      </span>
                    </div>

                    {/* Details der Karte */}
                    <div className="flex flex-col gap-2 pt-3 border-t border-secondary/10 text-sm">
                      <div className="flex justify-between items-center text-secondary">
                        <span className="flex items-center gap-1.5">
                          <Droplets size={16} className="text-blue-500" /> Luftfeuchtigkeit
                        </span>
                        <span className="font-bold ">
                          {Math.floor(temp.humidity)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-secondary">
                        <span className="text-xs">Zeitpunkt</span>
                        <span className="text-xs font-medium">{temp.datePlusTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}