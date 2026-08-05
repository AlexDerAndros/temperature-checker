import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input, Button, BackButton } from "./Components";
import { GoogleIcon } from "../icons/GoogleIcon";
import { Eye, EyeOff } from "lucide-react";

type BackButtonType = {
   onClick: () => void;
};
const formStyle = " mt-5 w-full flex flex-col justify-center items-center gap-y-5";
const inputStyle = "w-9/10 md:w-7/10 lg:w-1/2";

export function Login({ onClick }: BackButtonType) {
  // 1. NEUER STATE: Sichtbarkeit des Passworts
  const [showPassword, setShowPassword] = useState(false);

  const {
    emailInput,
    passwordInput,
    setEmailInput,
    setPasswordInput,
    SignIn,
  } = useAuth();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    SignIn();
  };

  // Hilfsvariablen
  const passwordType = showPassword ? "text" : "password";

  return (
    <form onSubmit={handleLogin} className={formStyle}>
      <BackButton onClick={onClick} />
      <h2 className="font-bold text-xl mb-3">Login</h2>
      
      {/* 2. E-Mail Input (Bleibt gleich) */}
      <Input
        type="text"
        placeholder="E-Mail Adresse..."
        value={emailInput}
        setValue={setEmailInput}
        addStyle={inputStyle}
      />

      {/* 3. DAS NEUE PASSWORT-FELD-LAYOUT */}
      {/* Der Container MUSS w-full md:w-1/2 lg:w-1/3 sein und RELATIVE positioniert */}
     
      <div className="relative w-9/10 md:w-7/10 lg:w-1/2 ">
        <Input
          type={passwordType} // Dynamischer Typ ("password" oder "text")
          placeholder="Passwort..."
          value={passwordInput}
          setValue={setPasswordInput}
          isPassword={true} 
          addStyle="w-full"
        />

        {/* 4. Das Icon absolut positionieren */}
        <button
          type="button" // Wichtig: Darf kein Submit auslösen!
          onClick={() => setShowPassword(!showPassword)} // Toggle Logic
          className="cursor-pointer absolute right-6 top-1/2 -translate-y-1/2 text-tertiary hover:text-secondary transition-colors duration-200"
          aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" /> // Auge durchgestrichen
          ) : (
            <Eye className="h-5 w-5" /> // Normales Auge
          )}
        </button>
      </div>
    
      <Button type="submit" text="Einloggen"  />
      <GoogleLogin />
    </form>
  );
}

export function Register({onClick}:BackButtonType) {
   const {emailInput, passwordInput, setEmailInput,
     setPasswordInput, CreateUser} = useAuth(); 
   const handleRegister = (e:React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     CreateUser();    
   };
    return (
       <form onSubmit={handleRegister} className={formStyle}>
        <BackButton onClick={onClick}/>
        <h2 className={`font-bold`}>Registrierung</h2>
        <Input type="text" placeholder="E-Mail Adresse angeben..." value={emailInput}
        setValue={setEmailInput}/>
        <Input type="password" placeholder="Passwort erstellen..." value={passwordInput}
        setValue={setPasswordInput}/>
        <Button type="submit" text="Registrieren"/>
        <GoogleLogin/>
     </form>
    );
}

 function GoogleLogin() {
  const { SignInWithGoogle } = useAuth();
  return (
    <Button 
      type="button"
      text="Mit Google anmelden" 
      onClick={SignInWithGoogle} 
      icon={<GoogleIcon />} 
    />
  );
}