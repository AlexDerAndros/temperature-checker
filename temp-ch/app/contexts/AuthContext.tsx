"use client";

import { addUser } from "@/backend/actions";
import { GoogleLogin, auth } from "@/config/firebaseClient";
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  User 
} from "firebase/auth";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthType = {
  user: User | null;           // Der eingeloggte Firebase-User
  emailInput: string;          // Formular-Feld E-Mail
  passwordInput: string;       // Formular-Feld Passwort
  error: string;
  loading: boolean;
  setEmailInput: (val: string) => void;
  setPasswordInput: (val: string) => void;
  SignIn: () => Promise<void>;
  CreateUser: () => Promise<void>; 
  SignOut: () => Promise<void>;
  SignInWithGoogle: () => Promise<void>; 
};

const AuthContext = createContext<AuthType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Auth-Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register
  const CreateUser = async () => {
    setError('');
    if (emailInput.trim() && passwordInput.trim()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
        // Wir übergeben die UID und Email an die Server Action
        await addUser(userCredential.user.uid, userCredential.user.email);
      } catch (e: any) {
        setError(e.message || "Fehler bei der Registrierung");
      }
    }
  };

  // Login 
  const SignIn = async () => {
    setError('');
    if (emailInput.trim() && passwordInput.trim()) {
      try {
        await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      } catch (e: any) {
        setError(e.message || "Fehler beim Login");
      }
    }
  };

  const SignInWithGoogle = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, GoogleLogin);
      // Legt das Profil an, falls es noch nicht existiert
      await addUser(result.user.uid, result.user.email);
    } catch (e: any) {
      setError(e.message || "Google Login fehlgeschlagen");
    }
  };

  const SignOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      emailInput, 
      passwordInput, 
      error, 
      loading, 
      setEmailInput, 
      setPasswordInput, 
      CreateUser, 
      SignIn, 
      SignInWithGoogle, 
      SignOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden");
  }
  return context;
}