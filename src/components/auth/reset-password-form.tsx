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
import { Resetpass } from "@/actions/auth/reset";
import { useTransition } from "react";
import { toast } from 'sonner'
import { ResetSchema } from "@/lib/index";

export const ResetpasswordForm = () => {
  const [isPending, startTransition] =useTransition();


  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver:zodResolver(ResetSchema),
    defaultValues:{  
      email:"",
    }
  });

  const onSubmit = (values:z.infer<typeof ResetSchema>) =>{
    // Wrap startTransaction around the api call/ server actions

    const loading = toast.loading("Sending forget password mail")
    
    startTransition(()=>{
      Resetpass(values)
        .then((data)=>{
          if (data.error!==undefined) {
            toast.error(data.error, {
              closeButton: true,
              id: loading
            })
            console.error(data.error)
          } else {
            toast.success(data.success, {
              closeButton: true,
              id: loading
            });
            form.reset();
          }    
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