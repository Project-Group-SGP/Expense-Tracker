"use server"
import * as z from "zod"
import { RegisterSchema } from "@/lib/index"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import nodemailer from "nodemailer";

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

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      throw error;
    }
  });
}


export const Register = async (values: z.infer<typeof RegisterSchema>) => {
  const validation = RegisterSchema.safeParse(values)

  if (validation.error) return { error: "Error!", success: "" }

  const { email, password, name } = validation.data

  const existinguser = await getUserByEmail(email)

  if (existinguser) return { error: "User already exist!", success: "" }

  const hashedPassord = await bcrypt.hash(password, 10)

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassord,
    },
  })

  const verificationToken = await generateVerificationToken(email)

  sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: "Confirmation email sent!" }
}

export const maxDuration = 30; 