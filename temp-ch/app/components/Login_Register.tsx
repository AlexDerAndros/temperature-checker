import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input, Button, BackButton } from "./Components";
import { GoogleIcon } from "./GoogleIcon";

export function Login() {
   const[passwordType, setPasswordType] = useState("password");
   const {emailInput, passwordInput, setEmailInput,
     setPasswordInput, SignIn} = useAuth(); 
   const handleLogin = (e:React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     SignIn();    
   };
  return (
   <>
     <form onSubmit={handleLogin}>
        <h2 className={`font-bold`}>Login</h2>
        <Input type="text" placeholder="E-Mail Adresse" value={emailInput}
        setValue={setEmailInput}/>

        <Button type="submit" text="Einloggen"/>
        
     </form>
     <GoogleLogin/>
    </>  
  );
}

export function Register() {
   const {emailInput, passwordInput, setEmailInput,
     setPasswordInput, CreateUser} = useAuth(); 
   const handleRegister = (e:React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     CreateUser();    
   };
    return (
     <>
       <form onSubmit={handleRegister}>
        
       </form>
       <GoogleLogin/>
     </>   
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