import { db } from "@/lib/db";

export const getTwoFactorConformationByUserId= async(userId:string)=>{
  try{
    const twoFactorConformation = await db.twoFactorConfirmation.findUnique({
      where:{userId}
    });

    return twoFactorConformation;
  }catch{
    return null;
  }
}