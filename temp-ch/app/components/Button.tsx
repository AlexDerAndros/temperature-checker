type ButtonType = {
  text: string;
  bg: string;
  textColor: string;
  addStyle: string;
  type?: "button" | "submit" | "reset"; // <-- type ergänzen
  onClick?: () => void;
};

export function Button({
  text,
  onClick,
  bg,
  textColor,
  addStyle,
  type = "button" 
}: ButtonType) {
  const transition = "transition-alternate duration-300";
  return (
    <button 
      type={type} // <-- Hier dem HTML-Button mitgeben!
      onClick={onClick}
      className={`flex items-center justify-center w-1/2 md:w-1/3 lg:w-1/4 font-bold 
        text-md md:text-lg ${bg} ${textColor} px-6 py-2 rounded-lg
        hover:opacity-90 ${transition} cursor-pointer
        ${addStyle}`}
    >
      {text}
    </button>
  );
}