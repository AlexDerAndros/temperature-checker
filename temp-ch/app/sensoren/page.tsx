"use client"
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getRole } from "@/backend/getFrontend"; // Passe den Pfad bei Bedarf an

export default function Sensors() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkIsAdmin = async () => {
            if (user && user.email) {
                try {
                    const role = await getRole(user.email);
                    if(role == "admin" || role == "Admin") {
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

    return (
        // Korrigiert: h-screen statt h-sceen, top-16 statt top-15
        <div className="w-full h-screen fixed top-16 left-0 bg-inherit overflow-y-auto">
            <h2 className="w-full flex flex-col items-center font-bold pt-4">
                <span>Sensoren</span>
            </h2>
            <main className="p-4">
                {loading ? (
                    <p>Lade Benutzerdaten...</p>
                ) : (
                    <>
                        <p className="mb-4">
                            Status: {user ? `Eingeloggt als ${user.email}` : "Nicht eingeloggt"}
                        </p>
                        <p className="font-semibold">{isAdmin == true ? "Admin-Ansicht" : "User-Ansicht"}</p>
                        <div className="mt-4 p-4 border rounded shadow">
                            1. Sensor
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}