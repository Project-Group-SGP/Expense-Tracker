'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Mail } from "lucide-react"
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { promise } from 'zod';
// import z from 'zod'; 

// const FormSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
//   password:z.string().min(8).includes('@' || '#' || '$' || '&' ||'!'||'+'||'-',{message: "password should include special symbols(@,#,$,! ect)",})
// })

// type Form = z.infer<typeof FormSchema>;

const Signin = () => {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [requiredError, setRequiredError] = useState({
    emailReq: false,
    passReq: false,
  });

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState: any) => !prevState);
  }
  const router = useRouter();
  const email = useRef('');
  const password = useRef('');

  const handleSubmitGoogle = async () =>{
    await signIn("google");
    router.push('/');
  }

  const handleSubmitFacebook = async() =>{
    await signIn("facebook");
    router.push('/');
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (!email.current || !password.current) {
      setRequiredError({
        emailReq: email.current ? false : true,
        passReq: password.current ? false : true,
      });
      return;
    }

    await new Promise((res)=>setTimeout(res, 1000));
    // try{
    //   const check:Form = {
    //     username: email.current,
    //     password:password.current
    //   }
    // }catch(e){
    //   console.log(e);
    // }
    setCheckingPassword(true);
    const res = await signIn('credentials', {
      username: email.current,
      password: password.current,
      redirect: false,
    });

    if (!res?.error) {
      router.push('/');
      toast.success('Signed In');
    } else {
      toast.error('oops something went wrong..!');
      setCheckingPassword(false);
    }
  };
  return (
    <section className=" flex h-screen items-center justify-center">
      <Card className="mx-auto w-[70%] md:w-[70%] lg:w-[30%]">
        <CardHeader>
          <CardTitle>Signin to your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="email" ><span className={requiredError.emailReq?' text-red-500':''}>Email</span></Label>
              <Input
                name="email"
                id="email"
                placeholder="name@email.com"
                onChange={(e) => {
                  setRequiredError((prevState) => ({
                    ...prevState,
                    emailReq: false,
                  }));
                  email.current = e.target.value;
                }}
              />
              {requiredError.emailReq && (
                <span className="text-red-500">Email is required</span>
              )}
            </div>
            <div className="relative flex flex-col gap-4">
              <Label><span className={requiredError.passReq?' text-red-500':''}>Password</span></Label>
              <div className="flex rounded-lg border">
                <Input
                  className="border-0"
                  name="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  onChange={(e) => {
                    setRequiredError((prevState) => ({
                      ...prevState,
                      passReq: false,
                    }));
                    password.current = e.target.value;
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      setIsPasswordVisible(false);
                      handleSubmit();
                    }
                  }}
                />
                <button
                  className="absolute bottom-0 right-0 flex h-10 items-center px-4 text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {requiredError.passReq && (
                <span className="text-red-500">Password is required</span>
              )}
            </div>
          </div>
          <Button
            className="my-3 w-full"
            disabled={checkingPassword}
            onClick={handleSubmit}
          >
            <Mail className="mr-2 h-4 w-4" /> Login With Mail
          </Button>
          <div className="relative mt-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-muted-foreground ligth: bg-sarthak_L dark:bg-sarthak_d">Or continue with</span>
              </div>
            </div>
          <div className='grid grid-cols-2'>
            <Button
              className="my-3 w-full"
              onClick={handleSubmitGoogle}
              variant="ghost"
              >
              <FaGoogle className="mr-2 h-4 w-4" /> Google
            </Button>
            <Button
              className="my-3 w-full"
              onClick={handleSubmitFacebook}
              variant="ghost"
              >
              <FaFacebook className="mr-2 h-4 w-4" /> FaceBook
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Signin;