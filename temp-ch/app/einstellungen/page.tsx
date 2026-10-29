"use client";
import Link from "next/link";
import { X, User, ShieldCheck, Thermometer, Sliders, Edit3, LogOut } from "lucide-react";
import { BackButton } from "@/components/Components";
import { useState, useEffect, useRef } from "react";
import { Input, Button } from "@/components/Components";
import { getSettings } from "@/backend/getFrontend";
import { updateSettings } from "@/backend/actions";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkLight } from "@/contexts/DarkLightContext";
import { gsap } from "gsap";

export default function Settings() {
    const { user, SignOut } = useAuth();
    const { container, containerHover } = useDarkLight();
    const [low, setLow] = useState("");
    const [high, setHigh] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [userInfos, setUserInfos] = useState<any>(null);
    
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (pageRef.current) {
            gsap.fromTo(
                pageRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
        }
    }, []);

    const switchEditMode = () => {
        setErrorMsg(null);
        setSuccessMsg(null);
        setEditMode((prev) => !prev);
    };

    const getUserInfos = async () => {
        if (!user || !user.email) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setErrorMsg(null);
            const result = await getSettings(user.email);
            
            if (result && result.success === true) {
                setUserInfos(result.settings);
                if (result.settings) {
                    setHigh(result.settings.highestTemp ?? "");
                    setLow(result.settings.lowestTemp ?? "");
                }
            } else {
                setErrorMsg("Fehler beim Laden der Einstellungen aus der Datenbank.");
            }
        } catch (e) {
            console.error("Netzwerk- oder Serverfehler:", e);
            setErrorMsg("Unerwarteter Fehler beim Abrufen der Daten.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUserInfos = async () => {
        if (!user || !user.email) return;

        if (high === "" || low === "") {
            setErrorMsg("Bitte fülle beide Temperaturfelder aus.");
            return;
        }

        if (Number(high) <= Number(low)) {
            setErrorMsg("Die Höchsttemperatur muss über der Niedrigstemperatur liegen.");
            return;
        }

        try {
            setErrorMsg(null);
            setSuccessMsg(null);
            
            const result = await updateSettings(user.email, high, low);
            
            if (result && result.success === true) {
                setSuccessMsg("Einstellungen erfolgreich gespeichert!");
                await getUserInfos();
                switchEditMode();
                
                setTimeout(() => setSuccessMsg(null), 3000);
            } else {
                const errString = typeof result?.error === "string" 
                    ? result.error 
                    : (result?.error instanceof Error ? result.error.message : "Fehler beim Speichern der Daten.");
                setErrorMsg(errString);
            }
        } catch (e: unknown) {
            console.error("Fehler beim Update:", e);
            const errorMessage = e instanceof Error ? e.message : "Ein unerwarteter Fehler ist aufgetreten.";
            setErrorMsg(errorMessage);
        }
    };

    let niceName = "";
    if (user && user.email) {
        const email = user.email;
        const username = email.split('@')[0]; 
        niceName = username
            .replace(/[._]/g, ' ') 
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }
    
    useEffect(() => {
       getUserInfos();
    }, [user]);

    return (
        <div ref={pageRef} className="w-full min-h-screen flex flex-col items-center px-4 py-8">
            {/* Top Bar mit Zurück-Button */}
            <div className="w-full max-w-2xl flex justify-start mb-8">
                <Link href="/">
                    <BackButton />
                </Link>
            </div>

            {/* Vollwertiger Seiten-Container */}
            <main className="w-full max-w-2xl flex flex-col gap-6">
                
                {/* Seiten-Titel */}
                <div className="flex items-center justify-between border-b border-secondary/20 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                            <Sliders size={26} />
                        </div>
                        <div>
                            <h1 className="font-bold text-2xl">Einstellungen</h1>
                            <p className="text-sm text-secondary">Konfiguriere deine Account- und Schwellenwerte</p>
                        </div>
                    </div>
                </div>

                {/* Globales Error- oder Erfolgs-Feedback */}
                {errorMsg && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-medium">
                        {successMsg}
                    </div>
                )}

                {/* Profil-Info */}
                <div className="flex items-center gap-4 py-2">
                    <div className={`p-3 rounded-full ${container}`}>
                        <User size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-secondary">Angemeldet als</span>
                        <span className="font-bold text-lg">{niceName || "Gast"}</span>
                    </div>
                </div>

                {/* Inhalt / Schwellenwerte */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <p className="text-secondary animate-pulse">Lade Einstellungen...</p>
                    </div>
                ) : userInfos ? (
                    <div className="flex flex-col gap-6">
                        
                        {/* Rolle */}
                        <div className={`flex items-center justify-between p-4 rounded-2xl ${container} border border-secondary/10`}>
                            <div className="flex items-center gap-2 text-sm text-secondary">
                                <ShieldCheck size={20} className="text-indigo-500" />
                                <span>Berechtigungs-Rolle</span>
                            </div>
                            <span className="font-semibold text-sm px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                                {userInfos.role === "admin" ? "Admin" : "Benutzer"}
                            </span>
                        </div>
                        {/* Ausloggen Sektion */}
                        <div className="  flex flex-col gap-3">
                            <button 
                                onClick={SignOut}
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm"
                            >
                                <LogOut size={18} />
                                Ausloggen
                            </button>
                        </div>

                        {/* Schwellenwerte Sektion */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-semibold flex items-center gap-2">
                                    <Thermometer size={20} className="text-amber-500" />
                                    Temperatur-Grenzwerte
                                </span>
                                
                                {!editMode && (
                                    <button 
                                        onClick={switchEditMode}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                                    >
                                        <Edit3 size={14} />
                                        Werte bearbeiten
                                    </button>
                                )}
                            </div>

                            {editMode ? (
                                <div className={`flex flex-col gap-5 p-6 rounded-3xl border border-indigo-500/40 bg-indigo-500/5 shadow-inner ${container}`}>
                                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Bearbeitungsmodus aktiv</span>
                                    
                                    {/* Eingabefeld 1: Höchste Temperatur mit klarem Label */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-secondary">Neue höchste Temperatur (Max-Limit)</label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-grow">
                                                <Input type="number" value={high} placeholder="z.B. 30" setValue={setHigh} />
                                            </div>
                                            <span className="font-bold text-lg">°C</span>
                                        </div>
                                    </div>

                                    {/* Eingabefeld 2: Niedrigste Temperatur mit klarem Label */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-secondary">Neue niedrigste Temperatur (Min-Limit)</label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-grow">
                                                <Input type="number" value={low} placeholder="z.B. 15" setValue={setLow} />
                                            </div>
                                            <span className="font-bold text-lg">°C</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 mt-2">
                                        <Button 
                                            text="Änderungen speichern" 
                                            onClick={handleUpdateUserInfos} 
                                            addStyle="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-semibold transition shadow-md" 
                                        />
                                        <button 
                                            onClick={switchEditMode}
                                            className={`p-3 rounded-xl border border-secondary/20 ${containerHover} transition cursor-pointer`}
                                            aria-label="Abbrechen"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className={`p-5 rounded-2xl ${container} border border-secondary/10 flex flex-col gap-1 shadow-sm`}>
                                        <span className="text-xs text-secondary">Maximales Limit</span>
                                        <span className="font-extrabold text-2xl text-warm">
                                            {userInfos.highestTemp !== undefined ? `${userInfos.highestTemp}°C` : "Nicht gesetzt"}
                                        </span>
                                    </div>
                                    <div className={`p-5 rounded-2xl ${container} border border-secondary/10 flex flex-col gap-1 shadow-sm`}>
                                        <span className="text-xs text-secondary">Minimales Limit</span>
                                        <span className="font-extrabold text-2xl text-cold">
                                            {userInfos.lowestTemp !== undefined ? `${userInfos.lowestTemp}°C` : "Nicht gesetzt"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                      
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                        <p className="text-secondary">Keine Benutzerdaten gefunden oder Zugriff verweigert.</p>
                        <button 
                            onClick={getUserInfos}
                            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
                        >
                            Erneut versuchen
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}