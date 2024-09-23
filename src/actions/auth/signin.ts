"use server"
import { SigninSchema } from "@/lib/index"
import { signIn } from "@/auth"
import * as z from "zod"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { getUserByEmail } from "@/data/user"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { getTwoFactorConformationByUserId } from "@/data/two-factor-conformation"
import { AuthError } from "next-auth"
import nodemailer from "nodemailer"

async function sendVerificationEmail(email: string, token: string) {
  const VerificationLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`
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
            <img src="${process.env.BASE_URL}/SpendWIse-5.png" alt="SpendWise Logo" width="150">
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
  }
  console.log("\n\nVerification Mail about to send\n\n");

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      throw error
    }
  })
  console.log("\n\nVerification Mail send\n\n");
}

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
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
    subject: "Your SpendWise Two-Factor Authentication Code",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your SpendWise Two-Factor Authentication Code</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .logo { text-align: center; margin-bottom: 20px; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; }
        .code { font-size: 24px; font-weight: bold; text-align: center; color: #4CAF50; letter-spacing: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="${process.env.BASE_URL}/SpendWIse-5.png" alt="SpendWise Logo" width="150">
        </div>
        <div class="content">
            <h2 style="color: #4CAF50;">Your Two-Factor Authentication Code</h2>
            <p>To complete your login to SpendWise, please use the following code:</p>
            <p class="code">${token}</p>
            <p>This code will expire in 10 minutes. If you didn't attempt to log in, please contact our support team immediately.</p>
        </div>
    </div>
</body>
</html>`,
  }
  console.log("\n\n2FA Mail about to send\n\n");

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      throw error
    }
  })

  console.log("\n\n2FA Mail send\n\n");
}

export const Signin = async (
  values: z.infer<typeof SigninSchema>,
  callbackUrl?: string | null
) => {
  const validationeddFields = SigninSchema.safeParse(values)

  if (validationeddFields.error)
    return { error: "Invalid fields!", success: "" }

  const { email, password, code } = validationeddFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: "Email does not exist" }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    )

    sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: "Confirmation email sent!!" }
  }

  const check = await bcrypt.compare(password, existingUser.password)

  if (!check) return { error: "Invalid Password" }

  if (existingUser.isTwoFactorEnable && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if (!twoFactorToken) return { error: "Invalid code!" }

      if (twoFactorToken.token !== code) return { error: "Invalid code!" }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()

      if (hasExpired) return { error: "Token Has Expired!" }

      await db.tokens.delete({
        where: { id: twoFactorToken.id, type: "TwoFactor" },
      })

      const existingConformation = await getTwoFactorConformationByUserId(
        existingUser.id
      )

      if (existingConformation)
        await db.twoFactorConfirmation.delete({
          where: { id: existingConformation.id },
        })

      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)

      console.log("2FA: ", twoFactorToken)

      sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { twoFactor: true }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  } catch (e: any) {
    console.error("Error during signIn:", e)
    if (e instanceof AuthError) {
      switch (e.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }
    throw e
  }
}