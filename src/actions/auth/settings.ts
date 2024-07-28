"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";

export const settings = async (
  values:z.infer<typeof SettingsSchema>
)=>{
  const user = await currentUserServer();

  if(!user) return {error:"unauthorized"};

  const dbuser = await getUserById(user?.id as string);

  if(!dbuser) return {error:"unauthorized"};

  if(user.isOAuth){
    values.email = undefined;
    values.password=undefined;
    values.newPassword=undefined;
    values.isTwoFactorEnabled=undefined;
  }

  if(values.email && values.email!==user.email){
    const existingUser = await getUserByEmail(values.email);

    if(existingUser)
        return {error:"Email already exist!!"}
    
    const verificationtoken = await generateVerificationToken(values.email);

    await sendVerificationEmail(
      verificationtoken.email,
      verificationtoken.token
    );

    return {success:"verification email send"};
  }

  if(values.password && values.newPassword && dbuser.password){
    if(values.password !== values.newPassword)
      return {error:"Password Doesn't Match"}

    const passwordsMatch = await bcrypt.compare(values.password,dbuser.password);

    if(!passwordsMatch)
      return {error:"Incorrect passwords"}

    const hashedPassword = await bcrypt.hash(values.newPassword,10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }


  await db.user.update({
    where:{id:dbuser?.id},
    data:{
      ...values,
    }
  });

  return {success:"Setting updated!"};
}