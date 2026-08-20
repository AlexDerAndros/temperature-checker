import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input, Button, BackButton } from "./Components";
import { GoogleIcon } from "../icons/GoogleIcon";
import { Eye, EyeOff } from "lucide-react";
type BackButtonType = {
   onClick: () => void;
};

const mainWrapperStyle = "w-full py-8 my-auto ";
const formStyle = " mt-5 w-full md:w-1/2 flex flex-col justify-center items-center gap-y-5 px-3";

const imgConStyle = " w-full flex flex-col-reverse md:flex-row   gap-16 items-center justify-center";
const inputStyle = "w-full relative";

const Image = () => (
  <img src="/images/Login_Register.png"
       className="w-[90%] md:w-[40%] object-cover rounded-lg"
       alt=""/>
);

export function Login({ onClick }: BackButtonType) {

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

  const passwordType = showPassword ? "text" : "password";

  return (
    <div className={mainWrapperStyle}>
   <BackButton onClick={onClick} />
    <div className={imgConStyle}>
     <Image/>
     <form onSubmit={handleLogin} className={formStyle}>
      
      <h2 className="font-bold text-xl mb-3">Login</h2>
      
      <Input
        type="text"
        placeholder="E-Mail Adresse..."
        value={emailInput}
        setValue={setEmailInput}
        addStyle={inputStyle}
      />

     
     
      <div className={inputStyle}>
        <Input
          type={passwordType}
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
    </div>
    </div>
  );
}

export function Register({ onClick }: BackButtonType) {
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false); // State für die Checkbox

  const {
    emailInput,
    passwordInput,
    setEmailInput,
    setPasswordInput,
    CreateUser
  } = useAuth(); 

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreedToTerms) return; // Sicherheits-Check
    CreateUser();    
  };

  const passwordType = showPassword ? "text" : "password";

  return (
    <div className={mainWrapperStyle}>
      <BackButton onClick={onClick} />
      <div className={imgConStyle}>
        <Image />
        <form onSubmit={handleRegister} className={formStyle}>
          <h2 className="font-bold text-xl mb-3">Registrierung</h2>
          
          <Input
            type="text"
            placeholder="E-Mail Adresse..."
            value={emailInput}
            setValue={setEmailInput}
            addStyle={inputStyle}
          />

          <div className={inputStyle}>
            <Input
              type={passwordType}
              placeholder="Passwort..."
              value={passwordInput}
              setValue={setPasswordInput}
              isPassword={true} 
              addStyle="w-full"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-6 top-1/2 -translate-y-1/2 text-tertiary hover:text-secondary transition-colors duration-200"
              aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Jugendschutz & DSGVO Checkbox (Art. 8 DSGVO / § 16 BDSG) */}
          <div className={`${inputStyle} flex items-start gap-3 text-xs text-slate-500 my-1`}>
            <input
              type="checkbox"
              id="privacy"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-500 cursor-pointer"
              required
            />
            <label htmlFor="privacy" className="cursor-pointer leading-tight">
              Ich bestätige, dass ich mindestens 16 Jahre alt bin (oder die Einwilligung der Erziehungsberechtigten vorliegt) und akzeptiere die Datenschutzbestimmungen.
            </label>
          </div>

          <Button 
            type="submit" 
            text="Registrieren" 
            disabled={!agreedToTerms} 
          />
          <GoogleLogin />
        </form>
      </div>
    </div>
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