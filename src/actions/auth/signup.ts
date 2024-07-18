"use server"
import * as z from 'zod'
import { RegisterSchema } from "@/schemas"
import bcrypt from "bcryptjs";
import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';


export const Register = async(values:z.infer<typeof RegisterSchema>) => {
  const validation = RegisterSchema.safeParse(values);

  if(validation.error)
    return {error:"Error!",success:""};

  const {email,password,name} = validation.data;


  const existinguser = await getUserByEmail(email);

  if(existinguser)
    return {error:"User already exist!",success:""};
  
  const hashedPassord = await bcrypt.hash(password,10);

  const user = await db.user.create({
    data:{
      name,
      email,
      password:hashedPassord,
    }
  });
  
  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email,verificationToken.token);

  return {success:"Conform email send!"};
}