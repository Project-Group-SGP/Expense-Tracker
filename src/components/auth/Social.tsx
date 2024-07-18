"use client";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const Social = () => {
  const [googlePassword, setgooglePassword] = useState<boolean>(false);
  const [facebookPassword, setfacebookPassword] = useState<boolean>(false);
  const onClick = (provider:"google"|"facebook") => {
    if(provider==="google"){
      setgooglePassword(true);
    }else{
      setfacebookPassword(true);
    }
    signIn(provider,{
      callbackUrl:DEFAULT_LOGIN_REDIRECT
    });
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
      <div className='grid grid-cols-2 w-full' >
        <Button
          className="my-3 w-full mb-2" 
          onClick={()=>onClick("google")}
          variant="ghost"
          >
          {googlePassword?<Loader2 className="mr-2 h-4 w-4 animate-spin" />:<FaGoogle className="mr-2 h-4 w-4" />}
            Google
        </Button>
        <Button
          className="my-3 w-full mb-2"
          onClick={()=>onClick("facebook")}
          variant="ghost"
          >
          {facebookPassword?<Loader2 className="mr-2 h-4 w-4 animate-spin" />:<FaFacebook className="mr-2 h-4 w-4" />}
            FaceBook
        </Button>
      </div>
</>
}