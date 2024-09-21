"use server";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/lib/index";
import nodemailer from "nodemailer";
import * as z from "zod";
import bcrypt from "bcryptjs";

async function sendVerificationEmail(email: string, token: string) {
  const VerificationLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Email Verification For SPEND WISE",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your SpendWise Account</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .logo { text-align: center; margin-bottom: 20px; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="/public/SpendWise-3.png" alt="SpendWise Logo" width="150">
        </div>
        <div class="content">
            <h2 style="color: #4CAF50;">Verify Your Email Address</h2>
            <p>Welcome to SpendWise! To get started, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href=${VerificationLink} class="button">Verify Email</a>
            </p>
            <p>If you didn't create an account with SpendWise, please ignore this email.</p>
        </div>
    </div>
</body>
</html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      throw error;
    }
  });
}


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

    sendVerificationEmail(
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