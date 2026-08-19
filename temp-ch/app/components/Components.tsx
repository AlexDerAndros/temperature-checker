import { useDarkLight } from "@/contexts/DarkLightContext";
import { ArrowLeft, } from "lucide-react";
import { ReactNode } from "react";

// Inputs


type InputType = {
  type: string;
  value: string;
  setValue: (val: string) => void;
  placeholder?: string;
  addStyle?: string;
  isPassword?: boolean; // <-- NEU
};

// 2. Componente anpassen
export function Input({
  type,
  value,
  setValue,
  placeholder = "",
  addStyle = "",
  isPassword = false,
}: InputType) {
  const { container } = useDarkLight();
  const transition = "transition-all duration-300";

  
  const passwordPadding = isPassword ? "pr-12" : "";

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      className={`text-md px-4 py-2 rounded-lg 
        outline-none focus:ring-2 focus:ring-blue-500
        ${container} ${transition} ${passwordPadding} ${addStyle}`} 
    />
  );
}

type ButtonType = {
  text: string;
  addStyle?: string;
  type?: "button" | "submit" | "reset"; 
  onClick?: () => Promise<void> | void;
  icon?: ReactNode;
  disabled?: boolean; 
};

export function Button({
  text,
  onClick,
  addStyle = "", 
  type = "button", 
  icon,
  disabled = false 
}: ButtonType) {
  const transition = "transition-alternate duration-300";
  return (
    <button 
      type={type} 
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center w-7/10 md:w-1/2 font-bold 
        text-md md:text-lg bg-btn text-white px-6 py-2 rounded-lg
        ${disabled 
          ? "opacity-50 cursor-not-allowed pointer-events-none" 
          : "hover:bg-btn-hover cursor-pointer"
        } 
        ${transition} ${addStyle}`}
    >
      {icon && <span className="mr-2">{icon}</span>} {text}
    </button>
  );
}

// Back-Button
type BackButton = {
  onClick?: () => void;
  addStyle?: string;
};

export function BackButton({ onClick, addStyle = "" }: BackButton) { // <-- Default "" hinzugefügt
  const transition = "transition-alternate duration-300";
  return (
   <div className="w-full flex items-start md:mb-5"> 
    <button 
      type="button" 
      onClick={onClick}
      className={`${transition} hover:opacity-90 cursor-pointer
        flex items-center justify-center font-bold gap-2
        text-md lg:text-lg px-6 py-2 rounded-lg bg-warm hover:bg-red-600
         text-inverse ${addStyle} `}
        >
      <ArrowLeft className="h-5 w-5" />
      <span>Zurück</span>
    </button>
    </div>
  );
}