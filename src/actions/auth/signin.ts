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

const sendTwoFactorTokenEmail = async (email: string, token: string) => {

  console.log(`Attempting to send 2FA email to: ${email} , token:${token}`);
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
        .code {
            font-size: 28px;
            font-weight: bold;
            color: #4CAF50;
            letter-spacing: 5px;
            text-align: center;
            margin: 20px 0;
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
            <img src="${process.env.BASE_URL}/SpendWise-5.png" alt="SpendWise Logo" width="150">
        </div>
        <div class="content">
            <h2>Your Two-Factor Authentication Code</h2>
            <p>To complete your login to SpendWise, please use the following code:</p>
            <p class="code" id="authCode">${token}</p>
            <p>
                Please copy the code above manually.
            </p>
            <p>This code will expire in 10 minutes. If you didn't attempt to log in, please contact our support team immediately.</p>
        </div>
        <div class="footer">
            © 2024 SpendWise. All rights reserved.
        </div>
    </div>
</body>
</html>`,
  }

  try {
    console.log('Transporter created, attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('2FA Mail sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending 2FA email:', error);
    throw error;
  }

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

    try{
      await sendVerificationEmail(verificationToken.email, verificationToken.token)
    }catch(error){
      console.error('Test email failed:', error);
    }
    return { success: "Confirmation email sent!!" }
  }

  console.log("Password during login",password,"Hashed pass:",existingUser.password)

  const hashedPassord = await bcrypt.hash(password, 10)
  
  const check = await bcrypt.compare(password, existingUser.password)

  console.log("login check password",check);
  
  console.log("cmp pass",hashedPassord==existingUser.password);

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


      try {
        await sendTwoFactorTokenEmail(twoFactorToken.email,twoFactorToken.token)
        console.log('Test email sent successfully');
      } catch (error) {
        console.error('Test email failed:', error);
      }

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