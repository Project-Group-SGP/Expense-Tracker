"use server"
import { SigninSchema } from "@/schemas"
import { signIn } from "@/auth"
import * as z from "zod"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { getUserByEmail } from "@/data/user"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens"
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { getTwoFactorConformationByUserId } from "@/data/two-factor-conformation"
import { AuthError } from "next-auth"

export const Signin = async (values: z.infer<typeof SigninSchema>,callbackUrl?:string|null) => {
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

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

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

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { twoFactor: true }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo:callbackUrl || DEFAULT_LOGIN_REDIRECT,
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
