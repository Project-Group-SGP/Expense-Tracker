"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { CardWrapper } from "./card-wrapper";
import { FormError } from "./form-error";
import { FromSuccess } from "./form-success";
import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { RegisterSchema } from "@/index";
import { Register } from "@/actions/auth/signup";
import { Loader2, Mail } from "lucide-react";
import { Passwordcmp } from "../Passwordcmp";
import zxcvbn from "zxcvbn";

export const RegisterForm = () => {

  const [error,setError]=useState<string|undefined>("");
  const [success,setSuccess] = useState<string|undefined>("");
  const [isPending, startTransition] =useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [password,setPassword] = useState<string>("");
  const [errorpassword,setErrorpassword] = useState<string|undefined>("");

  const Password_testResult =useMemo(()=>zxcvbn(password),[password]);
  console.log(Password_testResult);
  const password_score = useMemo(()=>(Password_testResult.score * 100)/4,[Password_testResult.score]);
  console.log(password_score);  

    const PassProgressColor = useCallback(() => {
      switch(Password_testResult.score){
        case 0:
          return '#828282'
        case 1:
          return '#EA1111';
        case 2:
          return '#FFAD00';
        case 3:
          return '#9bc158';
        case 4:
          return '#00b500';
        default:
          return 'none';
      }
    },[Password_testResult.score]);
  
    const createPassLable = useCallback(() => {
      switch(Password_testResult.score){
        case 0:
          return 'Very weak'
        case 1:
          return 'Weak';
        case 2:
          return 'Fear';
        case 3:
          return 'Good';
        case 4:
          return 'Strong';
        default:
          return 'none';
      }
    },[Password_testResult.score]);


  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver:zodResolver(RegisterSchema),
    defaultValues:{  
      email:"",
      password:"",
      name:"",
    }
  });
  const onSubmit = (values:z.infer<typeof RegisterSchema>) =>{
    // Wrap startTransaction around the api call/ server actions
    setError("");
    setSuccess("");
    if(password === ""){ setErrorpassword("Password field is empty!"); return;}
    if(password_score < 70){ setErrorpassword("Set an Strong password Password"); return;}
    startTransition(()=>{
      Register(values)
        .then((data:{success?:string,error?:string})=>{
            setError(data.error);
            setSuccess(data.success);
        })
        setPassword("");
    });
  }
  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLable="Already have an account?"
      backButtonHref="/auth/signin"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit   (onSubmit)}
          className="space-y-6"
        >
              <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({field})=>(
                <FormItem>
                  <FormLabel>
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Enter Your Name"
                      type="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
  )}
            />

            <FormField
              control={form.control}
              name="email"
              disabled={isPending}
              render={({field})=>(
                <FormItem>
                  <FormLabel>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Enter your Email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
  )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={isPending}
              render={({field})=>(
                <FormItem>
                  <FormLabel className={`${errorpassword!=="" && " text-red-600"}`}>
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Input
                          placeholder="Enter you Password"
                          {...field}
                          disabled={isPending}
                          type={isPasswordVisible ? "text" : "password"}
                          onChange={(e)=>{setPassword(e.target.value); setErrorpassword("");}}
                          value={password}
                          className="pr-10"
                        />
                        <Passwordcmp
                          isPasswordVisible={isPasswordVisible}
                          setisPasswordVisible={setIsPasswordVisible}
                        />
                    </div>
                  </FormControl>
                  {errorpassword==="" && password!=="" && isPending===false && !success && !error &&<div className="text-right">
                    <div className="w-full h-2 bg-slate-500 rounded-sm shadow-none">
                      <div className={`h-2 rounded-sm `} style={{background:PassProgressColor(),
                        width:password_score+"%",
                      }}>
                      </div>
                    </div>
                      <p style={{color:PassProgressColor()}} className="text-sm">{createPassLable()}</p>
                  </div>}
                 {errorpassword!=="" && <div className="text-[0.8rem] font-medium text-destructive">{errorpassword}</div>}
                </FormItem>
  )}
            />
            {!success && <FormError message={error}/>}
            {!error && <FromSuccess message={success} /> }
          <Button
            disabled={isPending}
            type='submit'
            className="w-full"
          >
           {isPending?<Loader2 className="mr-2 h-4 w-4 animate-spin" />:<Mail className="mr-2 h-4 w-4" />}  Register
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}