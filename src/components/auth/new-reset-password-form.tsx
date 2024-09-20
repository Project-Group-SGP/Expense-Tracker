"use client"
import { useSearchParams } from "next/navigation"
import { CardWrapper } from "./card-wrapper"
import { FormError } from "./form-error"
import { FromSuccess } from "./form-success"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form"
import { Input } from "../ui/input"

import { newPassword } from "@/actions/auth/new-password"
import { NewPasswordSchema } from "@/lib/index"
import { useState, useTransition } from "react"
export const NewResetPasswordForm = () => {
  const [Error ,setError] = useState<string|undefined>("");
  const [Success ,setSuccess] = useState<string|undefined>("");
  const [isPending, startTransition] =useTransition();

  const searchparams = useSearchParams();

  const token = searchparams.get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver:zodResolver(NewPasswordSchema),
    defaultValues:{  
      password:"",
      confirmPassword:""
    }
  });

  const onSubmit = (values:z.infer<typeof NewPasswordSchema>) =>{
    // Wrap startTransaction around the api call/ server actions
    setError("");
    setSuccess("");
    startTransition(()=>{
      newPassword(values,token)
        .then((data)=>{
          if(data.error===undefined)
            setSuccess(data.success);
          else
            setError(data.error);
        })
    });
  }
  return (
    <CardWrapper
      headerLabel="Enter a new Password"
      backButtonHref="/auth/signin"
      backButtonLable="Back to login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit   (onSubmit)}
          className="space-y-6"
        >
            <FormField
              control={form.control}
              name="password"
              disabled={isPending}
              render={({field})=>(
                <FormItem>
                  <FormLabel>
                    password
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="......"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
  )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              disabled={isPending}
              render={({field})=>(
                <FormItem>
                  <FormLabel>
                  confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="......."
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
  )}
            />
            {!Success && <FormError message={Error} key={Error}/>}
            
            {!Error && <FromSuccess message={Success} key={Success} />}
          <Button
            disabled={isPending}
            type='submit'
            className="w-full"
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
