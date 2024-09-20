"use server"
import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetSchema } from "@/lib/index"
import { z } from "zod"

export const Resetpass = async({email}:z.infer<typeof ResetSchema>) => {

  const validatedFields = ResetSchema.safeParse({email});

  if(validatedFields.error)
      return {error:"Invalid email!"};

  const existinguser = await getUserByEmail(validatedFields.data.email);

  if(!existinguser || !existinguser.emailVerified) 
    return {error : "Email not found!"};

  if(!existinguser.image){
    return {error: "You are registered with google"}
  }


  const passwordResettoken = await generatePasswordResetToken(validatedFields.data.email);


  await sendPasswordResetEmail(
  passwordResettoken.email,
  passwordResettoken.token,
  );

  return {success:"Reset email send!"}
} 