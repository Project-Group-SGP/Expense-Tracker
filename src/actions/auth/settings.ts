"use server";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/index";
import * as z from "zod";
import bcrypt from "bcryptjs";

export const settings = async (
  values:z.infer<typeof SettingsSchema>
)=>{
  // console.log("values: ",values);
  if(!values.email && !values.isTwoFactorEnable && !values.name && !values.newPassword && !values.password) 
    return {error:"No Changes are made"};
  if(!values.password && values.newPassword)
    return {error:"New Password is required"};
  if(values.password && !values.newPassword)
    return {error:"Old Password is required"};
  if(values.password==""){
    values.password = undefined;
    values.newPassword = undefined;
  }
  if(values.email && values.password){
    return {error:"Change one section at a time!!"};
  }

  const user = await currentUserServer();
  console.log("User:" ,user);
  
  if(!user)
     return {error:"unauthorized"};

  // if(user.email==values.email && user.name==values.name && user.isTwoFactorEnable==values.isTwoFactorEnable && !values.password && !values.newPassword)
  //   return {error:"No Changes are made"};

  const dbuser = await getUserById(user?.id as string);

  if(!dbuser) return {error:"unauthorized"};

  if(user.isOAuth){
    values.email = undefined;
    values.password=undefined;
    values.newPassword=undefined;
    values.isTwoFactorEnable=undefined;
  }
  console.log(values);

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
    const passwordsMatch = await bcrypt.compare(values.password,dbuser.password);

    if(!passwordsMatch)
      return {error:"Incorrect Oldpassword"}

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