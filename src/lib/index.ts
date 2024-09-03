import * as z from "zod"

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$#!%*?&]{8,}$/
)

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password should be minmum 8 characters" })
    .regex(passwordValidation, {
      message:
        "Password should include digits(0-9),special symbols(@,#,&...),Uppercase (A-Z),lowercase(a-z) letters",
    }),
  code: z.optional(z.string()),
})

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email field is empty!" }),
  password: z.string(),
  // .min(6,{message:"Password is min 6 length"})
  // .regex(passwordValidation, {
  //   message: 'Password should include digits(0-9),special symbols(@,#,&...),Uppercase (A-Z),lowercase(a-z) letters',
  // }),
  name: z.string().min(1, {
    message: "Name field is empty!",
  }),
})

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is Required" }),
})

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Minimum of 6 characters required" })
      .regex(passwordValidation, {
        message:
          "Password should include digits(0-9),special symbols(@,#,&...),Uppercase (A-Z),lowercase(a-z) letters",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnable: z.optional(z.boolean()),
  email: z.optional(z.string().email()),
  password: z.optional(z.string()),
  newPassword: z.optional(z.string()),
  theme: z.optional(z.string()),
})
//  .refine((data)=>{
//   if(data.password && !data.newPassword)      return false;

//   return true;
// },{message:"New password is required!",path:["newPassword"]})
// .refine((data)=>{
//   if(!data.password && data.newPassword)      return false;

//   return true;
// },{message:"password is required!",path:["password"]})

export const bulkdeleteProps = z.object({
  props: z.array(
    z.object({
      ids: z.string(),
      category: z.enum(["Income", "Expense"]),
    })
  ),
})

export const singledeleteProps = z.object({
  id: z.string(),
  category: z.enum(["Income", "Expense"]),
})

export const editTransactionProps = z.object({
  id: z.string(),
  category: z.enum(["Income", "Expense"]),
  props: z.object({
    amount: z.optional(z.number()),
    date: z.optional(z.date()),
    description: z.optional(z.string()),
  }),
})
