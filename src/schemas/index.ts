import * as z from 'zod';

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$#!%*?&]{8,}$/
);

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8,{message:'password should be minmum 8 characters'}).regex(passwordValidation, {
    message: 'Password should include digits(0-9),special symbols(@,#,&...),Uppercase (A-Z),lowercase(a-z) letters',
  }),
  code:z.optional(z.string()),
})

export const RegisterSchema = z.object({
  email:z.string().email({message:"Email is Required"}),
  password:z.string().min(6,{message:"Password is min 6 length"}).regex(passwordValidation, {
    message: 'Password should include digits(0-9),special symbols(@,#,&...),Uppercase (A-Z),lowercase(a-z) letters',
  }),
  name:z.string().min(1,{
    message:"Name is required",
  })
});

export const ResetSchema = z.object({
  email:z.string().email({message:"Email is Required"}),
})

export const NewPasswordSchema = z.object({
  password:z.string().min(6,{message:"Minimum of 6 characters required"}).regex(passwordValidation, {
    message: 'Password should include digits(0-9),special symbols(@,#,&...),Uppercase (A-Z),lowercase(a-z) letters',
  }),
  confirmPassword:z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});