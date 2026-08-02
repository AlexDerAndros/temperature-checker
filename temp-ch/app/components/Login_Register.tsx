import { useAuth } from "@/contexts/AuthContext";

export function Login() {
  const {emailInput, passwordInput, setEmailInput,
     setPasswordInput, CreateUser, SignInWithGoogle} = useAuth(); 
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
      
    }
  return (
    
      <></>
  );
}

export function Register() {
    return (
      <></>
    );
}

function LogReg() {
  return (
    <>
    
    </>
  )
}