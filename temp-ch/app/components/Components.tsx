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
};

export function Input({
  type,
  value,
  setValue,
  placeholder = "",
  addStyle = ""
}: InputType) {
  const { container } = useDarkLight();
  const transition = "transition-all duration-300";

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      className={`w-full md:w-1/2 lg:w-1/3 text-md px-4 py-2 rounded-lg 
        outline-none focus:ring-2 focus:ring-blue-500
        ${container} ${transition} ${addStyle}`}
    />
  );
}

// Button
type ButtonType = {
  text: string;
  addStyle?: string;
  type?: "button" | "submit" | "reset"; 
  onClick?: () => Promise<void>;
  icon?: ReactNode;
};

export function Button({
  text,
  onClick,
  addStyle = "", 
  type = "button", 
  icon
}: ButtonType) {
  const transition = "transition-alternate duration-300";
  return (
    <button 
      type={type} 
      onClick={onClick}
      className={`flex items-center justify-center w-1/2 md:w-1/3 lg:w-1/4 font-bold 
        text-md md:text-lg bg-btn text-white px-6 py-2 rounded-lg
        hover:bg-btn-hover ${transition} cursor-pointer
        ${addStyle}`}
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
    <button 
      type="button" 
      onClick={onClick}
      className={`${transition} hover:opacity-90 cursor-pointer
        flex items-center justify-center font-bold gap-2
        text-md lg:text-lg px-6 py-2 rounded-lg bg-warm text-inverse ${addStyle}`}
    >
      <ArrowLeft className="h-5 w-5" />
      <span>Zurück</span>
    </button>
  );
}