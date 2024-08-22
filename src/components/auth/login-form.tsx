"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { CardWrapper } from "./card-wrapper"
import { FormError } from "./form-error"
import { FromSuccess } from "./form-success"
import { useState, useTransition } from "react"
import { SigninSchema } from "@/index"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Passwordcmp } from "../Passwordcmp"
import { Loader2, Mail } from "lucide-react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Signin } from "@/actions/auth/signin"

export const LoginForm = () => {
  const [showTwoFactor, setShowTwoFactor] = useState<boolean | undefined>()
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()
  const [isDisabled,setDisabled] = useState<boolean>(false);
  const searchparams = useSearchParams()
  const urlError =
    searchparams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";
  const callbackUrl = searchparams.get("callbackUrl")
  console.log(urlError);

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof SigninSchema>) => {
    setError("")
    setSuccess("")
    startTransition(() => {
      setDisabled(true);
      Signin(values,callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset()
            setError(data?.error || urlError)
          }
          if (data?.success) {
            form.reset()
            setSuccess(data?.success)
          }
          if (data?.twoFactor) {
            setShowTwoFactor(true)
          }
        })
        .catch(() => {
          setError("Something went wrong")
        })
        setDisabled(false);
    })
  }
  return (
    <CardWrapper
      headerLabel="Sign in to your Account"
      backButtonLable="Don't have an account?"
      backButtonHref="/auth/signup"
      disabled={isDisabled}
      setDisabled={setDisabled} 
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <div className="flex justify-center items-center text-center">
                    <InputOTP maxLength={6} disabled={isDisabled} {...field }>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!showTwoFactor && (
            <>
              <FormField
                control={form.control}
                name="email"
                disabled={isDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="xyz@gmail.com"
                        {...field}
                        disabled={isDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                disabled={isDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter you Password"
                          {...field}
                          disabled={isDisabled}
                          type={isPasswordVisible ? "text" : "password"}
                        />
                        <Passwordcmp
                          isPasswordVisible={isPasswordVisible}
                          setisPasswordVisible={setIsPasswordVisible}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <Button
                      disabled={isDisabled}
                      className="mt-[-10px] h-0 px-0 pt-2 font-normal"
                      variant={"link"}
                      size={"sm"}
                      asChild
                    >
                      <Link href={isDisabled ? "#" : "/auth/reset"}>
                        Forget password?
                      </Link>
                    </Button>
                  </FormItem>
                )}
              />
            </>
          )}
          {!success && <FormError message={error} />}
          {!error && <FromSuccess message={success} />}
          <Button
            disabled={isDisabled}
            type="submit"
            className="w-full space-y-0 py-0"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}{" "}
            {showTwoFactor ? "Confirm" : "Login with Mail"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
