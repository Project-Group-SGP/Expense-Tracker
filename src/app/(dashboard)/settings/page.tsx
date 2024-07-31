"use client"

import { useCurrentUserClient } from "@/hooks/use-current-user";
import React, { useCallback, useEffect, useMemo } from "react"
import { Card ,CardHeader,CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/auth/settings";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from "@/schemas";
import { Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { FormError} from "@/components/auth/form-error";
import { FromSuccess }from "@/components/auth/form-success";
import { Switch } from "@/components/ui/switch";
import zxcvbn from "zxcvbn";
import { Passwordcmp } from "@/components/Passwordcmp";
import { ModeToggle } from "@/components/ModeToggle";
import { useTheme } from "next-themes";


const SettingsPage = () => {
  const user = useCurrentUserClient();
  const {update} = useSession();
  const [isPending,startTransition]=useTransition();
  const [error,setError] = useState<string|undefined>();
  const [success,setSuccess] = useState<string|undefined>();
  const [isPasswordVisible1, setIsPasswordVisible1] = useState<boolean>(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState<boolean>(false);
  const [oldpassword,setoldPassword] = useState<string>("");
  const [password,setPassword] = useState<string>("");
  const [errorpassword,setErrorpassword] = useState<string|undefined>("");
  const [errorpassword1,setErrorpassword1] = useState<string|undefined>("");

  const Password_testResult =useMemo(()=>zxcvbn(password),[password]);
  console.log(Password_testResult);
  const password_score = useMemo(()=>(Password_testResult.score * 100)/4,[Password_testResult.score]);

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

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver:zodResolver(SettingsSchema),
    defaultValues:{
      // used undefined not "" becatuse prisma will save this-> "" in db when we don't what to save any thing in db use undefined 
      name:user?.name ||undefined,
      email:user?.email ||undefined,
      password:undefined,
      newPassword:undefined,
      isTwoFactorEnable:user?.isTwoFactorEnable||undefined,
      theme:undefined,
    }
  });
  const onSubmit = (values:z.infer<typeof SettingsSchema>)=>{
    setError("");
    setSuccess("");
    if(oldpassword!==""){
      if(password === ""){ setErrorpassword("Password field is empty!"); return;}
      if(password_score < 70){ setErrorpassword("Set an Strong password Password"); return;}
    }
    if(password!==""){
      if(oldpassword===""){setErrorpassword1("Password field is empty!"); return;}
    }
    // console.log(values);
    // if(password == "" && oldpassword =="" && !values.email && !values.isTwoFactorEnable && !values.name){
    //   setSuccess("Theme successfully saved");
    //   return;
    // }
    values.theme = undefined;
    const newvalues = {...values,password:oldpassword,newPassword:password}
    console.log("values:",newvalues);
    startTransition(()=>{
      settings(newvalues)
        .then((data)=>{
          if(data.error)
            setError(data.error)
          else if (data.success){
            //update the current session to get updated values form db not old values when seson is created
            update();
            setSuccess(data.success)
          }
        })
        .catch((e)=>{
          setError("Something went wrong!!");
        });
    })
  }
  console.log("is oauth:",user);
  return (
    <Card className="w-[600px] text-left"> 
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Settings
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <FormField 
                disabled={isPending}
                control={form.control}
                name="name"
                render = {({field})=>(
                  <FormItem>
                    <FormLabel className="text-left block ml-2">Name</FormLabel>
                    <FormControl>
                      <Input
                      disabled={isPending}
                      {...field}
                      placeholder="jhon deo"
                      defaultValue={user?.name}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              {user?.isOAuth===false?
              <>
                <FormField 
                  disabled={isPending}
                  control={form.control}
                  name="email"
                  render = {({field})=>(
                    <FormItem>
                      <FormLabel className="text-left block ml-2">Email</FormLabel>
                      <FormControl>
                        <Input
                        disabled={isPending}
                        placeholder="xyz@gmail.com"
                        defaultValue={user?.email}
                        {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
               <FormField
              control={form.control}
              name="password"
              disabled={isPending}
              render={({field})=>(
                <FormItem>
                  <FormLabel className={`${errorpassword1!=="" && " text-red-600"}`}>
                   Old Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Input
                          placeholder="Enter you Password"
                          {...field}
                          disabled={isPending}
                          type={isPasswordVisible1 ? "text" : "password"}
                          onChange={(e)=>{setoldPassword(e.target.value);setErrorpassword1("");setError("");setSuccess("");}}
                          value={oldpassword}
                          className="pr-10"
                        />
                        <Passwordcmp
                          isPasswordVisible={isPasswordVisible1}
                          setisPasswordVisible={setIsPasswordVisible1}
                        />
                    </div>
                  </FormControl>
                  {errorpassword1!=="" && <div className="text-[0.8rem] font-medium text-destructive">{errorpassword1}</div>}
                </FormItem>
  )}
            />
                <FormField 
                  disabled={isPending}
                  control={form.control}
                  name="newPassword"
                  render = {({field})=>(
                    <FormItem>
                  <FormLabel className={`${errorpassword!=="" && " text-red-600"}`}>
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                        <Input
                          placeholder="Enter you Password"
                          {...field}
                          disabled={isPending}
                          type={isPasswordVisible2 ? "text" : "password"}
                          onChange={(e)=>{setPassword(e.target.value); setErrorpassword("");setError("");setSuccess("");}}
                          value={password}
                          className="pr-10"
                        />
                        <Passwordcmp
                          isPasswordVisible={isPasswordVisible2}
                          setisPasswordVisible={setIsPasswordVisible2}
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
              </>
              :<></>
              }
            {user?.isOAuth===false &&
            <FormField 
                disabled={isPending}
                control={form.control}
                name="isTwoFactorEnable"
                render = {({field})=>(
                  <FormItem className="flex justify-between rounded-lg items-center border p-3 shadow-sm">
                    <div className="space-y-0.5">
                    <FormLabel className="text-left block ml-2">Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable two factor authentication for your account
                    </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        defaultChecked={user?.isTwoFactorEnable}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            }
            <FormField 
                disabled={isPending}
                control={form.control}
                name="theme"
                render = {({field})=>(
                  <FormItem className="flex justify-between rounded-lg items-center border p-3 shadow-sm py-0 pb-1">
                    <div className="space-y-0.5">
                      <FormLabel className="text-left block ml-2 text-center pt-1">Theme</FormLabel>
                    </div>
                    <FormControl>
                      <div className="hidden md:block lg:block text-center flex justify-center items-center">
                        <ModeToggle/>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            {error && <FormError message={error} key={error}/>}
            {success && <FromSuccess message={success} key={success}/>}
            <Button disabled={isPending} type="submit" className="text-lg text-center px-14">
              Save
            </Button>
          </form>
        </Form>
        
      </CardContent>
    </Card>
  )
}

export default SettingsPage;