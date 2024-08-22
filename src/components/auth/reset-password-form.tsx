"use client"
import { CardWrapper } from "./card-wrapper";
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
import { FormError } from "./form-error";
import { FromSuccess } from "./form-success";
import { Resetpass } from "@/actions/auth/reset";
import { useState, useTransition } from "react";
import { ResetSchema } from "@/index";

export const ResetpasswordForm = () => {
  const [error,setError]=useState<string|undefined>("");
  const [success,setSuccess] = useState<string|undefined>("");
  const [isPending, startTransition] =useTransition();


  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver:zodResolver(ResetSchema),
    defaultValues:{  
      email:"",
    }
  });

  const onSubmit = (values:z.infer<typeof ResetSchema>) =>{
    // Wrap startTransaction around the api call/ server actions
    setError("");
    setSuccess("");
    startTransition(()=>{
      Resetpass(values)
        .then((data)=>{
            setError(data?.error);
            //TODO 2 factor authentation 
            setSuccess(data?.success);
            
        })
    });
  }
  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonHref="/auth/signup"
      backButtonLable="Don't have an account"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit   (onSubmit)}
          className="space-y-6"
        >

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
                      placeholder="Enter Your Email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
  )}
            />
            {!success && <FormError message={error} key={error}/>}
            
            {!error && <FromSuccess message={success} key={success} />}
          <Button
            disabled={isPending}
            type='submit'
            className="w-full"
          >
            send reset pass email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}