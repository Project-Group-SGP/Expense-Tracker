"use server"
import * as z from "zod"
import { RegisterSchema } from "@/lib/index"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import nodemailer from "nodemailer"


async function sendVerificationEmail(email: string, token: string) {
  const VerificationLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`
  console.log("Varification Link",VerificationLink);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

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
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 5px;
        }
        h2 {
            color: #4CAF50;
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            font-size: 16px;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
            text-align: center;
        }
        .button:hover {
            background-color: #45a049;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 30px;
        }
        @media (max-width: 600px) {
            .container {
                padding: 15px;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="${process.env.BASE_URL}/SpendWIse-5.png" alt="SpendWise Logo" width="150">
        </div>
        <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Welcome to SpendWise! To get started, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="${VerificationLink}" class="button">Verify Email</a>
            </p>
            <p>If you didn't create an account with SpendWise, please ignore this email.</p>
        </div>
        <div class="footer">
            © 2024 SpendWise. All rights reserved.
        </div>
    </div>
</body>
</html>`,
  }

  try{
    console.log('Transporter created, attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification Mail sent successfully:', info.response);
    return info;
  }catch (error) {
    console.error('Error sending Verification email:', error);
    throw error;
  }
}

export const Register = async (values: z.infer<typeof RegisterSchema>) => {
  const validation = RegisterSchema.safeParse(values)

  if (validation.error) return { error: "Error!", success: "" }

  console.log("Register data", validation.data);

  const { email, password, name } = validation.data;

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

  try{
    await sendVerificationEmail(verificationToken.email, verificationToken.token)
  }catch(error){
    console.error("Error while sending Verification Mail:",error);
  }
  return { success: "Confirmation email sent!" }
}