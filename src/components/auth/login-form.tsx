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
import { SigninSchema } from "@/schemas"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Passwordcmp } from "../Passwordcmp"
import { Loader2, Mail } from "lucide-react"
import { Signin } from "@/actions/auth/signin"

export const LoginForm = () => {
  const [showTwoFactor, setShowTwoFactor] = useState<boolean | undefined>()
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const searchparams = useSearchParams()
  const urlError =
    searchparams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with diffrent provider!"
      : ""
  console.log(urlError)

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
      Signin(values)
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
    })
  }
  return (
    <CardWrapper
      headerLabel="Sign in to your Account"
      backButtonLable="Don't have an account?"
      backButtonHref="/auth/signup"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123456"
                      disabled={isPending}
                    />
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
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="xyz@gmail.com"
                        {...field}
                        disabled={isPending}
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter you Password"
                          {...field}
                          disabled={isPending}
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
                      disabled={isPending}
                      className="mt-[-10px] h-0 px-0 pt-2 font-normal"
                      variant={"link"}
                      size={"sm"}
                      asChild
                    >
                      <Link href={isPending ? "#" : "/auth/reset"}>
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
            disabled={isPending}
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
