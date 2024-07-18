"use server"

import { getUserByEmail } from "@/data/user"
import {  getVerifationTokenByToken } from "@/data/verification-token"
import { db } from "@/lib/db"
import identityServer4 from "next-auth/providers/identity-server4"

export const newVerification = async(token:string)=>{
  const existingToken = await getVerifationTokenByToken(token);

  if(!existingToken){
      return {error:"Token does not exist!"}
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if(hasExpired){
    return {error : "Token has expited!"}
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if(!existingUser) {
    return {error : "User does not exist!"}
  }

  await db.user.update({
    where:{
      id: existingUser.id
    },
    data:{
      emailVerified:new Date(),

      // Reuse this when user wants to change there email
      email:existingToken.email
    }
  });

  await db.tokens.delete({
    where:{
      id:existingToken.id,
      type:"EmailVerification"
    }
  });

  return {success: "Email verified!" };
} 