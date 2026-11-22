"use client";
import { useState, useRef, useEffect } from "react";
import { useDarkLight } from "@/contexts/DarkLightContext";
import { useAuth } from "@/contexts/AuthContext";
import { setRoom, deleteRoom as deleteRoomAction } from "@/backend/actions";
import { getOwnRooms as getOwnRoomsAction } from "@/backend/getFrontend";
import { Moon, SunMoon, SettingsIcon, X, LogOut, User, ChevronRight, Trash2, Plus, Home, AlertCircle } from "lucide-react";
import { GithubIcon } from "@/icons/GitHubIcon";
import Link from "next/link";
import { gsap } from "gsap";

const iconStyle = "h-10 w-10 flex items-center justify-center p-2 cursor-pointer rounded-full transition hover:bg-containerHover hover:text-secondary";

export default function Header() {
  const { user, SignOut } = useAuth();
  const { darkMode, toggleTheme, container, containerHover } = useDarkLight();
  
  // Settings Tab State & Refs
  const [settingTab, setSettingTab] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Rooms Dropdown State & Refs
  const [roomsTab, setRoomsTab] = useState(false);
  const roomsMenuRef = useRef<HTMLDivElement>(null);
  const roomsButtonRef = useRef<HTMLButtonElement>(null);

  // Rooms Data & Error States (explizit als string | null typisiert)
  const [rooms, setRooms] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [click, setClick] = useState(false);
  const [errorGet, setErrorGet] = useState<string | null>(null);
  const [errorAdd, setErrorAdd] = useState<string | null>(null);
  const [errorDel, setErrorDel] = useState<string | null>(null);

  // GSAP Animation for Settings Tab
  useEffect(() => {
    if (settingTab && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [settingTab]);

  // GSAP Animation for Rooms Tab
  useEffect(() => {
    if (roomsTab && roomsMenuRef.current) {
      gsap.fromTo(
        roomsMenuRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [roomsTab]);

  // Close Settings Tab with Animation
  const animateCloseSettings = (callback?: () => void) => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        y: -10,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setSettingTab(false);
          if (callback) callback();
        }
      });
    } else {
      setSettingTab(false);
      if (callback) callback();
    }
  };

  // Close Rooms Tab with Animation
  const animateCloseRooms = (callback?: () => void) => {
    if (roomsMenuRef.current) {
      gsap.to(roomsMenuRef.current, {
        opacity: 0,
        y: -10,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setRoomsTab(false);
          if (callback) callback();
        }
      });
    } else {
      setRoomsTab(false);
      if (callback) callback();
    }
  };

  // Outside-Click Listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingTab &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        animateCloseSettings();
      }
      if (
        roomsTab &&
        roomsMenuRef.current &&
        !roomsMenuRef.current.contains(event.target as Node) &&
        roomsButtonRef.current &&
        !roomsButtonRef.current.contains(event.target as Node)
      ) {
        animateCloseRooms();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingTab, roomsTab]);

  const getOwnRooms = async () => {
    try {
      setErrorGet(null);
      if (user && user.email) {
        const result = await getOwnRoomsAction(user.email);
        if (result.success && result.ownRooms) {
          // Räume sicher typisieren / casten für die Sortierung
          const sortedRooms = [...result.ownRooms].sort((a: any, b: any) => {
            const timeA = new Date(a.updated_at || a.updatedAt || 0).getTime();
            const timeB = new Date(b.updated_at || b.updatedAt || 0).getTime();
            return timeB - timeA; // Absteigend (neueste zuerst)
          });
          setRooms(sortedRooms);
        } else {
          setErrorGet(typeof result.error === "string" ? result.error : "Fehler beim Laden der Räume.");
        }
      }
    } catch (e) {
      setErrorGet("Fehler beim Empfangen der Räume: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  // Add Room with Error Handling
  const addRoom = async () => {
    setErrorAdd(null);
    if (!name.trim()) {
      setErrorAdd("Bitte gib einen Raumnamen ein.");
      return;
    }

    try {
      if (user && user.email) {
        const result = await setRoom(name.trim(), user.email, 0, 0);
        if (result.success) {
          setName("");
          setErrorAdd(null);
          getOwnRooms();
        } else {
          setErrorAdd(typeof result.error === "string" ? result.error : "Fehler beim Hinzufügen.");
        }
      }  
    } catch (e) {
      setErrorAdd(e instanceof Error ? e.message : String(e));
    }
  };

  // Delete Room with Error Handling
  const deleteRoom = async (roomName: string) => {
    setErrorDel(null);
    try {
      const result = await deleteRoomAction(roomName);
      if (result.success) {
        setErrorDel(null);
        getOwnRooms();
      } else {
        setErrorDel(typeof result.error === "string" ? result.error : "Fehler beim Löschen.");
      } 
    } catch (e) {
       setErrorDel(e instanceof Error ? e.message : String(e));
    }
  };

  useEffect(() => {
    if (user?.email) {
      getOwnRooms();
    }
  }, [user?.email]);

  let niceName = "";
  if (user && user.email) {
    const email = user.email;
    const username = email.split('@')[0]; 
    niceName = username
      .replace(/[._]/g, ' ') 
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  let headerContent = null;

  if (user) {
    headerContent = (
      <>
        <h5 className="font-bold text-lg md:text-xl tracking-tight">TempCheck</h5>
        
        {/* Räume Popover / Dropdown */}
        <div className="relative">
          <button 
            ref={roomsButtonRef}
            onClick={() => {
              if (roomsTab) animateCloseRooms();
              else {
                if (settingTab) animateCloseSettings();
                setRoomsTab(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition bg-containerHover hover:opacity-80 border border-gray-200 dark:border-gray-800 cursor-pointer shadow-sm"
            aria-label="Räume verwalten"
          >
            <Home size={16} className="text-indigo-500" />
            <span>Räume</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold">
              {rooms.length}
            </span>
          </button>

          {roomsTab && (
            <div 
              ref={roomsMenuRef}
              className={`absolute left-1/2 -translate-x-1/2 top-12 w-80 p-4 rounded-2xl ${container} shadow-2xl border border-gray-200 dark:border-gray-800 z-50 flex flex-col gap-3`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-semibold tracking-wider text-secondary uppercase">Raumverwaltung</span>
                <button onClick={() => animateCloseRooms()} className="p-1 rounded-full hover:bg-containerHover transition">
                  <X size={18} />
                </button>
              </div>

              {/* Error Handling Displays */}
              {errorGet && (
                <div className="flex items-center gap-2 p-2.5 bg-red-500/10 text-red-500 rounded-xl text-xs font-medium">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorGet}</span>
                </div>
              )}
              {errorAdd && (
                <div className="flex items-center gap-2 p-2.5 bg-red-500/10 text-red-500 rounded-xl text-xs font-medium">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorAdd}</span>
                </div>
              )}
              {errorDel && (
                <div className="flex items-center gap-2 p-2.5 bg-red-500/10 text-red-500 rounded-xl text-xs font-medium">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorDel}</span>
                </div>
              )}

              {/* Add Room Form */}
              <div className="flex gap-2 items-center pt-1">
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorAdd) setErrorAdd(null);
                  }} 
                  placeholder="Neuer Raum Name..." 
                  className="flex-grow px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => { if (e.key === 'Enter') addRoom(); }}
                />
                <button 
                  onClick={addRoom}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center justify-center shadow-md shadow-indigo-500/20 cursor-pointer"
                  title="Raum hinzufügen"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Rooms List (sorted) */}
              <div className="max-h-60 overflow-y-auto flex flex-col gap-1.5 pt-1 pr-1">
                {rooms.length === 0 ? (
                  <p className="text-xs text-secondary text-center py-4">Keine Räume vorhanden.</p>
                ) : (
                  rooms.map((room) => (
                    <div 
                      key={room.id || room.name}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${containerHover} transition text-sm font-medium group`}
                    >
                      <Link 
                        href={`/${room.name}/uebersicht`}
                        onClick={() => animateCloseRooms()}
                        className="truncate flex-grow hover:text-indigo-500 transition"
                      >
                        {room.name}
                      </Link>
                      <button 
                        onClick={() => deleteRoom(room.name)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition opacity-80 group-hover:opacity-100 cursor-pointer"
                        title="Raum löschen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Einstellungs-Dropdown */}
        <div className="relative">
          <button 
            ref={buttonRef}
            onClick={() => {
              if (settingTab) animateCloseSettings();
              else {
                if (roomsTab) animateCloseRooms();
                setSettingTab(true);
              }
            }} 
            className={iconStyle} 
            aria-label="Einstellungen öffnen"
          >
            <SettingsIcon />
          </button>

          {settingTab && (
            <div 
              ref={menuRef}
              className={`absolute right-0 top-12 w-64 p-4 rounded-2xl ${container} shadow-2xl border border-gray-200 dark:border-gray-800 z-50 flex flex-col gap-3`}
            >
              {/* Header im Popover */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-semibold tracking-wider text-secondary uppercase">Übersicht</span>
                <button onClick={() => animateCloseSettings()} className="p-1 rounded-full hover:bg-containerHover transition">
                  <X size={18} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 py-1">
                <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-primary dark:text-white">
                  <User size={20} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs text-secondary">Eingeloggt als</span>
                  <span className="font-bold text-sm truncate">{niceName}</span>
                </div>
              </div>

              {/* Liste mit Optionen inklusive "Mehr..." / Einstellungen-Seite */}
              <ul className="flex flex-col gap-1 pt-1">
                <li>
                  <Link 
                    href="/einstellungen" 
                    onClick={() => animateCloseSettings()}
                    className={`flex items-center justify-between py-2 px-3 rounded-xl ${containerHover} text-sm font-medium transition`}
                  >
                    <span>Mehr... (Einstellungen)</span>
                    <ChevronRight size={16} className="text-secondary" />
                  </Link>
                </li>
              </ul>

              {/* Ausloggen-Button */}
              <button 
                onClick={() => animateCloseSettings(() => SignOut())}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 mt-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
              >
                <LogOut size={16} />
                Ausloggen
              </button>
            </div>
          )}
        </div>
      </>
    );
  } else {
    headerContent = (
      <>
        <h5 className="font-bold text-lg md:text-xl">Willkommen bei TempCheck!</h5>
        <a href="https://github.com/AlexDerAndros/temperature-checker" className={iconStyle} target="_blank" rel="noopener noreferrer">
          <GithubIcon />
        </a>
      </>
    );
  }

  return (
    <header className="w-full flex flex-row items-center justify-between px-5 py-3">
      <span className={iconStyle} onClick={toggleTheme} aria-label="Theme umschalten">
        {darkMode ? <Moon size={25} /> : <SunMoon size={25} />}
      </span>  
      {headerContent}
    </header>
  );
}