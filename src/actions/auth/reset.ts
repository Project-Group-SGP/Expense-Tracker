"use server"
import { getUserByEmail } from "@/data/user"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetSchema } from "@/lib/index"
import nodemailer from "nodemailer"
import { z } from "zod"

const sendPasswordResetEmail = async(email: string, token: string,name:string) => {
  const resetLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`

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
    subject: "Reset Your Spendwise Password",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Spendwise Password</title>
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
            <h1>Reset Your Password</h1>
            <p>Hello,${name}</p>
            <p>We received a request to reset your SpendWise password. Don't worry, we've got you covered!</p>
            <p style="text-align: center;">
                <a href="${resetLink}" class="btn" style="color: white;">Reset My Password</a>
            </p>
            <div class="security-notice">
                🔒 This link will expire in 24 hours for your security.
            </div>
            <div class="divider"></div>
            <p style="font-size: 14px;">If you're having trouble with the button, copy and paste this link into your browser:</p>
            <p class="link">${resetLink}</p>
            <p style="font-size: 14px; color: #666;">If you didn't request this password reset, please ignore this email or contact our support team.</p>
        </div>
        <div class="footer">
            <p>Need help? Contact us at etracker690@gmail.com</p>
            <p>&copy; 2023 SpendWise. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
  }
  try {
    console.log('Transporter created, attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('resetpass Mail sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending resetpass email:', error);
    throw error;
  }
}

export const Resetpass = async ({ email }: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse({ email })

  if (validatedFields.error) return { error: "Invalid email!" }

  const existinguser = await getUserByEmail(validatedFields.data.email)

  if (!existinguser || !existinguser.emailVerified)
    return { error: "Email not found!" }

  if (existinguser.image !== null) {
    return { error: "You are registered with google" }
  }

  const passwordResettoken = await generatePasswordResetToken(
    validatedFields.data.email
  )
  try{
    await sendPasswordResetEmail(passwordResettoken.email, passwordResettoken.token,existinguser.name);
  }catch(error){
    console.error("Error while sending resetpass mail",error);
  }
  
  return { success: "Reset email send!" }
}
