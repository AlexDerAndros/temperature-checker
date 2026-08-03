import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input, Button, BackButton } from "./Components";
import { GoogleIcon } from "./GoogleIcon";

type BackButtonType = {
   onClick: () => void;
};
const formStyle = " w-full flex flex-col justify-center items-center gap-y-5";

export function Login({onClick}:BackButtonType) {
   //const[passwordType, setPasswordType] = useState("password");
   const {emailInput, passwordInput, setEmailInput,
     setPasswordInput, SignIn} = useAuth(); 
   const handleLogin = (e:React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     SignIn();    
   };
  return (
     <form onSubmit={handleLogin} className={formStyle}>
        <BackButton onClick={onClick}/>
        <h2 className={`font-bold`}>Login</h2>
        <Input type="text" placeholder="E-Mail Adresse..." value={emailInput}
        setValue={setEmailInput}/>
        <Input type="password" placeholder="Passwort..." value={passwordInput}
        setValue={setPasswordInput}/>
        <Button type="submit" text="Einloggen"/>
        <GoogleLogin/>
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