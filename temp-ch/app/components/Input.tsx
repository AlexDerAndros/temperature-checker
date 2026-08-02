import { useDarkLight } from "@/contexts/DarkLightContext";

type InputType = {
    type: string;
    value: string;
    setValue: (val: string) => void;
    addStyle: string;
}

export function Input({addStyle,type, value, setValue}:InputType) {
    const{container, containerHover} = useDarkLight();
     const hover = `hover:scale-[1.02] hover:shadow-md active:scale-[1.02] md:active:scale-[1.01] active:shadow-md ${containerHover} cursor-pointer`;
     const transition = "transition-alternate duration-300";
    return (
       <input type={type} onChange={(e) => setValue(e.target.value)}
    className={`w-1/2  lg:w-1/3 
        text-md  px-6 py-2 rounded-lg ${container}
        ${hover} ${transition} cursor-pointer
        ${addStyle}`} value={value}/>
    );
}