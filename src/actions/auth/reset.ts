"use server"
import { getUserByEmail } from "@/data/user"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetSchema } from "@/lib/index"
import nodemailer from "nodemailer";
import { z } from "zod"

const sendPasswordResetEmail = async(email:string,token:string) => {
  const resetLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`;

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
    subject: "Verification",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your SpendWise Password</title>
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
            <h2 style="color: #4CAF50;">Reset Your Password</h2>
            <p>We received a request to reset your SpendWise password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
                <a href=${resetLink} class="button">Reset Password</a>
            </p>
            <p>If you didn't request a password reset, please ignore this email or contact our support team.</p>
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

export const Resetpass = async({email}:z.infer<typeof ResetSchema>) => {

  const validatedFields = ResetSchema.safeParse({email});

  if(validatedFields.error)
      return {error:"Invalid email!"};

  const existinguser = await getUserByEmail(validatedFields.data.email);

  if(!existinguser || !existinguser.emailVerified) 
    return {error : "Email not found!"};

  if(existinguser.image!==null){
    return {error: "You are registered with google"}
  }

  const passwordResettoken = await generatePasswordResetToken(validatedFields.data.email);

  await sendPasswordResetEmail(
    passwordResettoken.email,
    passwordResettoken.token,
  );

  return {success:"Reset email send!"}
} 