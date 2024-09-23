"use server"
import { getUserByEmail } from "@/data/user"
import {  getVerifationTokenByToken } from "@/data/verification-token"
import { db } from "@/lib/db"

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

  if(existingUser.emailVerified){
    return {error:"Email already verified!"}
  }

  if(existingUser.image!==null){
    return {error:"You are registered with google"}
  }

  try{
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
  }catch(e){
    return {error:"Error in EmailVerification"};
  }

  return {success: "Email verified!" };
} 