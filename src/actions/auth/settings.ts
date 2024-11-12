"use server"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateVerificationToken } from "@/lib/tokens"
import { SettingsSchema } from "@/lib/index"
import nodemailer from "nodemailer"
import * as z from "zod"
import bcrypt from "bcryptjs"

 
async function sendVerificationEmail(email: string, token: string,name:string) {
  const VerificationLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`;
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

  try {
    console.log('Transporter created, attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification Mail sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending Verification email:', error);
    throw error;
  }
}


export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  // console.log("values: ",values);
  if (
    !values.email &&
    !values.isTwoFactorEnable &&
    !values.name &&
    !values.newPassword &&
    !values.password
  )
    return { error: "No Changes are made" }
  if (!values.password && values.newPassword)
    return { error: "New Password is required" }
  if (values.password && !values.newPassword)
    return { error: "Old Password is required" }
  if (values.password == "") {
    values.password = undefined
    values.newPassword = undefined
  }
  if (values.email && values.password) {
    return { error: "Change one section at a time!!" }
  }

  const user = await currentUserServer()
  console.log("User:", user)

  if (!user) return { error: "unauthorized" }

  // if(user.email==values.email && user.name==values.name && user.isTwoFactorEnable==values.isTwoFactorEnable && !values.password && !values.newPassword)
  //   return {error:"No Changes are made"};

  const dbuser = await getUserById(user?.id as string)

  if (!dbuser) return { error: "unauthorized" }

  if (user.isOAuth) {
    values.email = undefined
    values.password = undefined
    values.newPassword = undefined
    values.isTwoFactorEnable = undefined
  }
  console.log(values)

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email)

    if (existingUser) return { error: "Email already exist!!" }

    const verificationtoken = await generateVerificationToken(values.email)

    try{
      await sendVerificationEmail(verificationtoken.email, verificationtoken.token,dbuser.name);
    }catch(error){
      console.error("Error while sending mail:",error);
    }
    return { success: "verification email send" }
  }

  if (values.password && values.newPassword && dbuser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbuser.password
    )

    if (!passwordsMatch) return { error: "Incorrect Oldpassword" }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10)
    values.password = hashedPassword
    values.newPassword = undefined
  }

  await db.user.update({
    where: { id: dbuser?.id },
    data: {
      ...values,
    },
  })

  return {success:"Setting updated!"};
}
