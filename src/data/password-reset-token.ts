import { db } from "@/lib/db";

export const getpasswordResetTokenByToken = async (token:string) =>{
  try{
    const passwordResetToken = await db.tokens.findUnique({
      where: {token,type:"PasswordReset"}
    });

    return passwordResetToken;
  }catch(e){
    return null;
  }
}

export const getpasswordResetTokenByEmail = async (email:string) =>{
  try{
    const passwordResetToken = await db.tokens.findFirst({
      where: {email,type:"PasswordReset"}
    });

    return passwordResetToken;
  }catch(e){
    return null;
  }
}