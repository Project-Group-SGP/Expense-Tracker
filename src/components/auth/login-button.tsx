"use client"
import { useRouter } from "next/navigation";

interface LoginButtonProps{
  children:React.ReactNode;
  mode?:"modal" | "redirect",
  asChild?:boolean;
};

export const LoginButton = ({children,mode="redirect",asChild}:LoginButtonProps) => {
  const route=useRouter();
  const onclick = () => {
    route.push("/auth/login");
  }

  if(mode=="modal"){
    <div>
    Todo Implement modal
  </div>
  }
  return (
    <span onClick={onclick} className="cursor-pointer">
      {children}
    </span>
  )
}