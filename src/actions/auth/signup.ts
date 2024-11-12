"use server"
import * as z from "zod"
import { RegisterSchema } from "@/lib/index"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import nodemailer from "nodemailer"


async function sendVerificationEmail(email: string, token: string, name: string) {
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
    subject: "Email Verification For Spendwise",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your SpendWise Account</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ffffff;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 3px solid #4CAF50;
        }
        .logo-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        .logo {
            max-width: 100px;
            height: auto;
        }
        .logo-text {
            font-size: 32px;
            font-weight: bold;
            color: #2E7D32;
            margin: auto 0;
        }
        .content {
            padding: 30px;
            background-color: #ffffff;
        }
        h1 {
            color: #2E7D32;
            margin-top: 0;
            font-size: 24px;
            text-align: center;
        }
        .btn {
            display: inline-block;
            padding: 12px 32px;
            background-color: #2E7D32;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
            border-top: 1px solid #eaeaea;
        }
        .divider {
            height: 1px;
            background-color: #eaeaea;
            margin: 20px 0;
        }
        .link {
            color: #2E7D32;
            word-break: break-all;
            font-size: 14px;
        }
        .security-notice {
            background-color: #F1F8E9;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 14px;
            color: #33691E;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="https://trackwithspendwise.vercel.app/SpendWIse-5.png" alt="SpendWise Logo" class="logo">
                <span class="logo-text">Spendwise</span>
            </div>
        </div>
        <div class="content">
            <h1>Verify Your Email Address</h1>
            <p>Hello,${name}</p>
            <p>Welcome to Spendwise! We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="${VerificationLink}" class="btn" style="color: white;">Verify Email</a>
            </p>
            <div class="security-notice">
                🔒 This link will expire in 24 hours for your security.
            </div>
            <div class="divider"></div>
            <p style="font-size: 14px;">If you're having trouble with the button, copy and paste this link into your browser:</p>
            <p class="link">${VerificationLink}</p>
            <p style="font-size: 14px; color: #666;">If you didn't create an account with Spendwise, please ignore this email or contact our support team.</p>
        </div>
        <div class="footer">
            <p>Need help? Contact us at etracker690@gmail.com</p>
            <p>&copy; 2023 Spendwise. All rights reserved.</p>
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
  if (existinguser) return { error: "User already exist!", success: "" }
  await sendVerificationEmail(verificationToken.email, verificationToken.token,name);
  }catch(error){
    console.error("Error while sending Verification Mail:",error);
  }
  return { success: "Confirmation email sent!" }
}