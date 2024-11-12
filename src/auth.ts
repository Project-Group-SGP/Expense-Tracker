import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUserById } from "./data/user"
import { getTwoFactorConformationByUserId } from "./data/two-factor-conformation"
import authOptions from "./auth.config"
import { getAccountByUserId } from "./data/account"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        })
      } catch (error) {
        console.error("Error in linkAccount event:", error)
      }
    },
  },
  callbacks: {
    // Modify the jwt token / Action to take while generation of token
    async jwt({ token }) {
      // token.sub has user id (USER table id )
      if (!token.sub) return token

      try {
        const existingUser = await getUserById(token.sub)

        if (!existingUser) return token

        token.isOAuth = !existingUser.password

        token.name = existingUser.name
        token.email = existingUser.email
        token.isTwoFactorEnable = existingUser.isTwoFactorEnable
        if (existingUser.emailVerified !== null)
          token.joininDate = existingUser.emailVerified
            .toISOString()
            .split("T")[0]

        // console.log("JWT callback token", token)
        return token
      } catch (error) {
        console.error("Error in jwt callback:", error)
        return token
      }
    },
    // Modify the session / Action to take while generation of session
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (session.user) {
        session.user.isTwoFactorEnable = token.isTwoFactorEnable as boolean

        session.user.name = token.name as string

        session.user.email = token.email as string

        session.user.isOAuth = token.isOAuth as boolean
        if (token.joininDate)
          session.user.joininDate = token.joininDate as string
      }

      return session
    },
    // Action to take when user sign in / login
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await db.user.findUnique({
            // @ts-ignore
            where: { email: user?.email },
          })

          if (existingUser) {
            // If the user exists but email is not verified, update the emailVerified field
            if (!existingUser.emailVerified) {
              await db.user.update({
                where: { id: existingUser.id },
                data: { emailVerified: new Date() },
              })
            }
            return true
          } else {
            // If it's a new user, emailVerified will be set automatically by the adapter
            return true
          }
        } catch (error) {
          console.error("Error in Google sign in:", error)
          return false
        }
      }

      try {
        const existingUser = await getUserById(user.id || "")

        // Prevent sign in without email verification
        if (!existingUser || !existingUser.emailVerified) return false

        // 2Factor Authentication check
        if (existingUser.isTwoFactorEnable) {
          const twoFactorConfirmation = await getTwoFactorConformationByUserId(
            existingUser.id
          )
          // console.log("n\n\n\n TFA: ", twoFactorConfirmation)
          if (!twoFactorConfirmation) return false

          // Delete two factor confirmation for next sign in
          await db.twoFactorConfirmation.delete({
            where: {
              id: twoFactorConfirmation.id,
            },
          })
        }
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authOptions,
})
