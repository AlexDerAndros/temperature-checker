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


 //Login
 const SignIn = async () => {
  setError('');

  if (!emailInput.trim() || !passwordInput.trim()) {
    setError('Bitte gib E-Mail und Passwort ein.');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, emailInput, passwordInput);
  } catch (err: any) {
    switch (err.code) {
      case "auth/invalid-email":
        setError("Ungültige E-Mail-Adresse.");
        break;
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        setError("E-Mail oder Passwort ist falsch.");
        break;
      case "auth/user-disabled":
        setError("Dieses Benutzerkonto wurde deaktiviert.");
        break;
      case "auth/too-many-requests":
        setError("Zu viele fehlgeschlagene Versuche. Bitte warte einen Moment.");
        break;
      default:
        setError("Ein unerwarteter Fehler ist aufgetreten.");
        break;
    }
  }
};
  // Register
  const CreateUser = async () => {
    setError('');

  if (!emailInput.trim() || !passwordInput.trim()) {
    setError('Bitte fülle alle Felder aus.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
    
    await addUser(userCredential.user.uid, userCredential.user.email);
  } catch (e: any) {
    
    switch (e.code) {
      case 'auth/email-already-in-use':
        setError('Diese E-Mail-Adresse wird bereits verwendet.');
        break;
      case 'auth/invalid-email':
        setError('Bitte gib eine gültige E-Mail-Adresse ein.');
        break;
      case 'auth/weak-password':
        setError('Das Passwort ist zu schwach (mindestens 6 Zeichen).');
        break;
      case 'auth/operation-not-allowed':
        setError('Die Registrierung mit E-Mail/Passwort ist aktuell deaktiviert.');
        break;
      default:
        // Falls der Fehler aus der Server Action (addUser) oder einem Netzwerkfehler stammt
        setError(e.message || 'Fehler bei der Registrierung. Bitte versuche es erneut.');
        break;
    }
  }
};
  // Google-Login 
  

 const SignInWithGoogle = async () => {
  setError('');

  try {
    const result = await signInWithPopup(auth, GoogleLogin);
    await addUser(result.user.uid, result.user.email);
  } catch (e: any) {
    switch (e.code) {
      case "auth/popup-closed-by-user":
        setError("Anmeldung abgebrochen.");
        break;
      case "auth/popup-blocked":
        setError("Das Anmeldefenster wurde vom Browser blockiert. Bitte Erlaubnis erteilen.");
        break;
      case "auth/cancelled-popup-request":
        break;
      case "auth/account-exists-with-different-credential":
        setError("Es existiert bereits ein Konto mit dieser E-Mail-Adresse unter einer anderen Anmeldemethode.");
        break;
      case "auth/unauthorized-domain":
        setError("Diese Seite ist für ein Google-Login nicht autorisiert!");  
        break;    
        default:
        setError(e.message || "Google Login fehlgeschlagen.");
        break;
    }
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