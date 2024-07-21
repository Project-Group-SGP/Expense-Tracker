import { DefaultSession, NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { SigninSchema } from "./schemas"
import { getUserByEmail } from "./data/user"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"

// Notice this is only an object, not a full Auth.js instance
const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const validatedFields = SigninSchema.safeParse(credentials)

        if (validatedFields.error) {
          return null
        }

        const { email, password } = validatedFields.data

        const user = await getUserByEmail(email)

        if (!user || !user.password) return null

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return null

        return user
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
} satisfies NextAuthConfig

export default authOptions
