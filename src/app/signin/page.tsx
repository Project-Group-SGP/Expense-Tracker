"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { Loader2, Mail } from "lucide-react"
import { FaFacebook, FaGoogle } from "react-icons/fa"
import { Passwordcmp } from "@/components/Passwordcmp"
import { signIn } from "next-auth/react"


const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$#!%*?&]{8,}$/
);

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8,{message:'password should be minmum 8 characters'}).regex(passwordValidation, {
    message: 'Password should include digits(0-9),special symbols(@,#,&...),Uppercase (A-Z),lowercase(a-z) letters',
  }),
})

export default function Signin(){

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [checkingPassword, setCheckingPassword] = useState<boolean>(false);
  const [emailPassword, setemailPassword] = useState<boolean>(false);
  const [googlePassword, setgooglePassword] = useState<boolean>(false);
  const [facebookPassword, setfacebookPassword] = useState<boolean>(false);
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password:""
      },
    })

    
  const handleSubmitGoogle = async () =>{
    setgooglePassword(true);
    setCheckingPassword(true);
    await signIn("google");
  }

  const handleSubmitFacebook = async() =>{
    setfacebookPassword(true);
    setCheckingPassword(true);
    await signIn("facebook");
  };

   
    function onSubmit(values: z.infer<typeof formSchema>) {
      setemailPassword(true);
      setCheckingPassword(true);
      console.log(values);
    }

    return (
      <section className=" flex h-screen items-center justify-center">
      <Card className="mx-auto w-[70%] md:w-[70%] lg:w-[30%]">
  <CardHeader>
    <CardTitle className="text-xl">Signin to your Account</CardTitle>
  </CardHeader>
  <CardContent className="pb-2">
  <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField 
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="xyz@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}  
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative ">
                    <Input placeholder="Enter you Password" {...field} type={isPasswordVisible?'text':'password'}/>
                    <Passwordcmp isPasswordVisible={isPasswordVisible} setisPasswordVisible={setIsPasswordVisible}/>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={checkingPassword} className="w-full mt-0" type="submit">
            {emailPassword?<Loader2 className="mr-2 h-4 w-4 animate-spin" />:<Mail className="mr-2 h-4 w-4" />}Login with Mail</Button>
        </form>
      </Form>
      <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-muted-foreground ligth: bg-sarthak_L dark:bg-sarthak_d">Or continue with</span>
              </div>
              </div>

  <div className='grid grid-cols-2 w-full' >
            <Button
              className="my-3 w-full"
              disabled={checkingPassword}
              onClick={handleSubmitGoogle}
              variant="ghost"
              >
              {googlePassword?<Loader2 className="mr-2 h-4 w-4 animate-spin" />:<FaGoogle className="mr-2 h-4 w-4" />} Google
            </Button>
            <Button
              className="my-3 w-full"
              disabled={checkingPassword}
              onClick={handleSubmitFacebook}
              variant="ghost"
              >
              {facebookPassword?<Loader2 className="mr-2 h-4 w-4 animate-spin" />:<FaFacebook className="mr-2 h-4 w-4" />}FaceBook
            </Button>
          </div>
  </CardContent>
</Card>
   </section>   
    )
}