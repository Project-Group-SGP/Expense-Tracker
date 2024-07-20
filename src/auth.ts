import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUserById } from "./data/user"
import { getTwoFactorConformationByUserId } from "./data/two-factor-conformation"
import authOptions from "./auth.config"

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

        if (existingUser) {
          token.isTwoFactorEnable = existingUser.isTwoFactorEnable
        }

        return token
      } catch (error) {
        console.error("Error in jwt callback:", error)
        return token
      }
    },
    // Modify the session / Action to take while generation of session
    async session({ token, session }) {
      console.log({ Sessiontoken: token, session })

      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (session.user) {
        session.user.isTwoFactorEnable = token.isTwoFactorEnable as boolean
      }

      return session
    },
    // Action to take when user sign in / login
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      console.log("signIn", user, account)
      if (account?.provider !== "credentials") return true

      try {
        const existingUser = await getUserById(user.id || "")

        // Prevent sign in without email verification
        if (!existingUser || !existingUser.emailVerified) return false

        // 2Factor Authentication check
        if (existingUser.isTwoFactorEnable) {
          const twoFactorConfirmation = await getTwoFactorConformationByUserId(
            existingUser.id
          )

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
