"use client"

import { useEffect, useState, useRef } from "react";
import { X } from 'lucide-react';
import Link from "next/link";
import gsap from "gsap";

import { useAuth } from "@/contexts/AuthContext";
import { useDarkLight } from "@/contexts/DarkLightContext";

import { getRole } from "@/backend/getFrontend"; 
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

    // Ref für die GSAP-Animation des Modals
    const formRef = useRef<HTMLFormElement>(null);

    const pressAdminForm = () => {
        setIsAdminForm(!isAdminForm);
    };

    // GSAP-Animation beim Öffnen/Schließen des Formulars
    useEffect(() => {
        if (isAdminForm && formRef.current) {
            gsap.fromTo(
                formRef.current,
                { opacity: 0, scale: 0.8, y: -30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
            );
        }
    }, [isAdminForm]);

    // Admin-Rolle prüfen
    useEffect(() => {
        const checkIsAdmin = async () => {
            if (user && user.email) {
                try {
                    const role = await getRole(user.email);
                    if (role === "admin" || role === "Admin") {
                        setIsAdmin(true);
                    }
                } catch (error) {
                    console.error("Fehler beim Abrufen der Rolle:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkIsAdmin();
    }, [user]);

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

    return (
        <div className="w-full h-screen fixed top-5 left-0 bg-inherit overflow-y-auto">
            <Link href="/">
                <BackButton />
            </Link>

            <h2 className="w-full flex flex-row items-center font-bold p-4 px-6 justify-between mt-10">
                <div></div>
                <div className="p-2">Sensoren</div>
                <div>
                    {isAdmin && (
                        <span className={iconStyle} onClick={pressAdminForm}>
                            +
                        </span>
                    )}
                </div>
            </h2>

           
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
                                <Input type="text" value={room} setValue={setRoom} addStyle={`w-full h-10 px-3 border border-gray-500`}/>
                            </div>
                            <div>
                                <label className="block text-sm mb-1 font-medium">Sensor ID (MAC / Controller)</label>
                                <Input type="text" value={sensorId} setValue={setSensorId} addStyle="w-full h-10 px-3 border border-gray-500" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 font-medium">User E-Mail</label>
                                <Input type="text" value={email} setValue={setEmail} addStyle="w-full h-10 px-3 border border-gray-500" />
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

            <main className="p-4">
                {loading ? (
                    <p>Lade Benutzerdaten...</p>
                ) : (
                    <div className="mt-4 p-4 border rounded shadow">
                        1. Sensor 
                    </div>
                )}
            </main>
        </div>
    );
}