"use client"

import { useEffect, useState, useRef } from "react";
import { X, Cpu, SlidersHorizontal } from 'lucide-react';
import Link from "next/link";
import gsap from "gsap";

import { useAuth } from "@/contexts/AuthContext";
import { useDarkLight } from "@/contexts/DarkLightContext";

import { getRole, getOwnSensors, getAllSensors } from "@/backend/getFrontend"; 
import { addSensor } from "@/backend/actions";
import { BackButton, Input } from "@/components/Components";

const iconStyle = "h-10 w-10 flex items-center justify-center p-2 cursor-pointer rounded-full transition hover:bg-containerHover hover:text-secondary text-3xl";

export default function Sensors() {
    const { user } = useAuth();
    const { container } = useDarkLight();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAdminForm, setIsAdminForm] = useState(false);
    
    // States für das Sensor-Formular
    const [room, setRoom] = useState('');
    const [sensorId, setSensorId] = useState('');
    const [email, setEmail] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [ownSensors, setOwnSensors] = useState<any[]>([]);
    const [allSensors, setAllSensors] = useState<any[]>([]);
    
    // View-Modus für Admins ("mine" oder "all")
    const [viewMode, setViewMode] = useState<'mine' | 'all'>('mine');

    // Refs für GSAP Animationen
    const formRef = useRef<HTMLFormElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);

    const pressAdminForm = () => {
        setIsAdminForm(!isAdminForm);
    };

    // GSAP Modal Animation
    useEffect(() => {
        if (isAdminForm && formRef.current) {
            gsap.fromTo(
                formRef.current,
                { opacity: 0, scale: 0.8, y: -30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
            );
        }
    }, [isAdminForm]);

    // Daten laden
    useEffect(() => {
        const initData = async () => {
            if (user && user.email) {
                try {
                    const role = await getRole(user.email);
                    if (role === "admin" || role === "Admin") {
                        setIsAdmin(true);
                        const allRes = await getAllSensors();
                        if (allRes.success) setAllSensors(allRes.allSensors);
                    }
                    const ownRes = await getOwnSensors(user.email);
                    if (ownRes.success) setOwnSensors(ownRes.ownSensors);
                } catch (error) {
                    console.error("Fehler beim Laden:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        initData();
    }, [user]);

  
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isAdmin) return; 
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        // Wenn weit genug gewischt wurde (> 50px)
        if (Math.abs(diff) > 50) {
            if (diff > 0 && viewMode === 'mine') {
                // Nach links gewischt -> Zu "Alle"
                switchView('all');
            } else if (diff < 0 && viewMode === 'all') {
                // Nach rechts gewischt -> Zu "Meine"
                switchView('mine');
            }
        }
    };

    const switchView = (mode: 'mine' | 'all') => {
        if (viewMode === mode) return;
        if (listRef.current) {
            gsap.to(listRef.current, {
                opacity: 0,
                x: mode === 'all' ? -30 : 30,
                duration: 0.2,
                onComplete: () => {
                    setViewMode(mode);
                    gsap.fromTo(
                        listRef.current,
                        { opacity: 0, x: mode === 'all' ? 30 : -30 },
                        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
                    );
                }
            });
        } else {
            setViewMode(mode);
        }
    };

    // Sensor abschicken
    const handleSubmitSensor = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setMessage('');

        try {
            const result = await addSensor(room, sensorId, email);
            if (result?.success) {
                setMessage('Sensor erfolgreich hinzugefügt!');
                setRoom('');
                setSensorId('');
                setEmail('');
                // Daten direkt neu laden
                const ownRes = await getOwnSensors(user?.email!);
                if (ownRes.success) setOwnSensors(ownRes.ownSensors);
                if (isAdmin) {
                    const allRes = await getAllSensors();
                    if (allRes.success) setAllSensors(allRes.allSensors);
                }
                setTimeout(() => {
                    setIsAdminForm(false);
                    setMessage('');
                }, 1500);
            } else {
                setMessage(result?.error || 'Fehler beim Speichern.');
            }
        } catch (error) {
            console.error(error);
            setMessage('Ein unerwarteter Fehler ist aufgetreten.');
        } finally {
            setFormLoading(false);
        }
    };

    const displayedSensors = isAdmin && viewMode === 'all' ? allSensors : ownSensors;

    return (
        <div className="w-full h-screen  top-5 left-0 bg-inherit overflow-y-auto">
            <Link href="/">
                <BackButton />
            </Link>

            <h2 className="w-full flex flex-row items-center font-bold p-4 px-6 justify-between mt-10">
                <div></div>
                <div className="p-2 text-xl">Sensoren</div>
                <div>
                    {isAdmin && (
                        <span className={iconStyle} onClick={pressAdminForm}>
                            +
                        </span>
                    )}
                </div>
            </h2>

            {/* Admin Schieberegler (Tabs) nur für Admins */}
            {isAdmin && (
                <div className="flex justify-center my-4">
                    <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-full">
                        <button 
                            onClick={() => switchView('mine')}
                            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${viewMode === 'mine' ? 'bg-emerald-600 text-white shadow' : 'text-gray-500'}`}
                        >
                            Meine Sensoren
                        </button>
                        <button 
                            onClick={() => switchView('all')}
                            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${viewMode === 'all' ? 'bg-emerald-600 text-white shadow' : 'text-gray-500'}`}
                        >
                            Alle Sensoren (Admin)
                        </button>
                    </div>
                </div>
            )}

            {/* Admin Formular Modal */}
            {isAdmin && isAdminForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
                    <form 
                        ref={formRef}
                        onSubmit={handleSubmitSensor}
                        className={`w-[90%] max-w-lg p-6 ${container} rounded-xl flex flex-col justify-between shadow-2xl border border-gray-700`}
                    >
                        <header className="w-full flex flex-row justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Neuen Sensor hinzufügen</h3>
                            <X className={iconStyle} onClick={pressAdminForm} />
                        </header>

                        <section className="w-full flex flex-col gap-4 my-2">
                            <div>
                                <label className="block text-sm mb-1 font-medium">Raum</label>
                                <Input type="text" value={room} setValue={setRoom} addStyle="w-full h-10 px-3 border border-gray-500 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 font-medium">Sensor ID (MAC / Controller)</label>
                                <Input type="text" value={sensorId} setValue={setSensorId} addStyle="w-full h-10 px-3 border border-gray-500 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 font-medium">User E-Mail</label>
                                <Input type="text" value={email} setValue={setEmail} addStyle="w-full h-10 px-3 border border-gray-500 rounded-lg" />
                            </div>

                            {message && (
                                <p className={`text-sm font-semibold ${message.includes('erfolgreich') ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {message}
                                </p>
                            )}
                        </section>

                        <footer className="w-full mt-6">
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                                {formLoading ? 'Wird gespeichert...' : 'Sensor in Datenbank eintragen'}
                            </button>
                        </footer>
                    </form>
                </div>
            )}

            {/* Sensor Liste mit Touch-Events & GSAP Ref */}
            <main 
                className="p-4 max-w-4xl mx-auto"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {loading ? (
                    <p className="text-center">Lade Sensoren...</p>
                ) : (
                    <div ref={listRef} className="flex flex-col gap-4">
                        <div className="text-xs text-center text-gray-400 mb-1">
                            {isAdmin ? `Ansicht: ${viewMode === 'mine' ? 'Meine Sensoren' : 'Alle Sensoren'} (Wischen zum Umschalten)` : 'Deine verknüpften Sensoren'}
                        </div>

                        {displayedSensors.length === 0 ? (
                            <div className={`p-6 rounded-xl text-center ${container} border border-gray-700 shadow`}>
                                <p className="text-gray-400">Keine Sensoren gefunden.</p>
                            </div>
                        ) : (
                            displayedSensors.map((sensor: any) => (
                                <div 
                                    key={sensor.id} 
                                    className={`flex flex-row items-center p-5 rounded-2xl shadow-lg border border-gray-700 ${container} transition hover:scale-[1.01]`}
                                >
                                    {/* Riesiges Sensor-Icon links */}
                                    <div className="p-4 bg-emerald-500/10 rounded-2xl mr-5 flex items-center justify-center text-emerald-500">
                                        <Cpu className="w-12 h-12" />
                                    </div>

                                    {/* Informationen rechts */}
                                    <div className="flex flex-col justify-center flex-grow gap-1">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-bold text-emerald-400">{sensor.room}</h3>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${sensor.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {sensor.active ? 'Aktiv' : 'Inaktiv'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-mono">ID: {sensor.sensorId}</p>
                                        <p className="text-xs text-gray-500">User: {sensor.user}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Letztes Signal: {sensor.lastSeen ? new Date(sensor.lastSeen).toISOString().slice(11, 19) : "Unbekannt"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}