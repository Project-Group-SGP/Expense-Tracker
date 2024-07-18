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
import { useState, useTransition } from "react";
import { RegisterSchema } from "@/schemas";
import { Register } from "@/actions/auth/signup";
import { Loader2, Mail } from "lucide-react";

export const RegisterForm = () => {

  const [error,setError]=useState<string|undefined>("");
  const [success,setSuccess] = useState<string|undefined>("");
  const [isPending, startTransition] =useTransition();

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
    startTransition(()=>{
      Register(values)
        .then((data:{success?:string,error?:string})=>{
            setError(data.error);
            setSuccess(data.success);
        })
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
                  <FormLabel>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Enter your password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
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