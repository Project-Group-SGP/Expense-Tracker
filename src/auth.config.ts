import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { SigninSchema } from "./schemas"
import { getUserByEmail } from "./data/user";
// import bcrypt  from "bcryptjs"
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

// import bcrypt from 'bcrypt';
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
        CredentialsProvider({
          name:'Email',
          credentials: {
            Email: { label: "email", type: "text", placeholder: "email" },
            Password: { label: "Password", type: "password" }
          },
      async authorize(credentials,req){
        const validatedFields = SigninSchema.safeParse(credentials);

        if(validatedFields.error){
            return null;
        }

        const {email,password} = validatedFields.data;

        const user = await getUserByEmail(email);

        if(!user || !user.password)
          return null;
        
        await bcrypt.compare(password, user.password, function(err:any, result:boolean) {
          if(result){
            return user;
          }
          return null;
        });

        return user;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID||"",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET||""
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID||"",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET||""
    })
    
  ],
} satisfies NextAuthConfig