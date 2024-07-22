"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

export const Social = ({disabled,setDisabled}:{disabled:boolean,setDisabled:any}) => {
  const [googlePassword, setgooglePassword] = useState<boolean>(false);
  const {theme} = useTheme();
  const [Theme,setTheme] = useState<string>(theme as string);
  console.log(theme=="dark"," theme:",theme);
  const onClick = () => {
    // setDisabled(true);
    setgooglePassword(true);
    signIn("google",{
      callbackUrl:DEFAULT_LOGIN_REDIRECT
    });

    // setDisabled(false);
  }
  return <>
      <div className="relative mt-4 w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex w-full justify-center text-xs uppercase">
          <span className="px-2 text-muted-foreground ligth: bg-sarthak_L dark:bg-sarthak_d">
            Or continue with
          </span>
        </div>
      </div>
      <div className='grid grid-cols-1 w-full' >
        <Button
          className="my-3 w-full mb-2" 
          onClick={()=>onClick()}
          variant={Theme=="dark" ?"ghost" :"outline"}
          disabled={disabled}
          >
          {googlePassword?<Loader2 className="mr-2 h-4 w-4 animate-spin" />:<FcGoogle className="mr-2 h-4 w-4" />}
            Google
        </Button>
      </div>
</>
}