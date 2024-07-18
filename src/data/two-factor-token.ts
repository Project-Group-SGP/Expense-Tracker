import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async(token:string) => {
  try{
    const twoFactorToken = await db.tokens.findUnique({
      where:{token,type:"TwoFactor"}
    });

    return twoFactorToken;
  }catch{
    return null;
  }
}

export const getTwoFactorTokenByEmail = async(email:string) => {
  try{
    const twoFactorToken = await db.tokens.findFirst({
      where:{email,type:"TwoFactor"}
    });

    return twoFactorToken;
  }catch{
    return null;
  }
}