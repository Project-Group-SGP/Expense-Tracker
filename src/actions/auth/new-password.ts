"use server"
import * as  z from "zod"
import { NewPasswordSchema } from "@/lib/index"
import { getpasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const newPassword = async(values:z.infer<typeof NewPasswordSchema>,token?:string|null) => {
  if(!token)
      return {error:"Missing token!"};
  
  const validatedFields = NewPasswordSchema.safeParse(values);

  if(validatedFields.error)
    return {error:"Invalid Fields!"};

  const {password} = validatedFields.data;

  const existingToken = await getpasswordResetTokenByToken(token);

  if(!existingToken)
    return {error:"Invalid token!"};

  const hasExpired = new Date(existingToken.expires) < new Date();

  if(hasExpired)
    return {error:"Token has expired!"}

  const existingUser = await getUserByEmail(existingToken.email);

  if(!existingUser)
    return {error:"Email does not exist"}

  if(existingUser.image!==null){
    return {error:"You are registered with google"}
  }

  const hashedPassword = await bcrypt.hash(password,10);

  await db.user.update({
    where:{
      id:existingUser.id
    },
    data:{
      password:hashedPassword
    }
  });

  await db.tokens.delete({
    where:{id:existingToken.id,type:"PasswordReset"}
  })

  return {success:"Password updated"}
}