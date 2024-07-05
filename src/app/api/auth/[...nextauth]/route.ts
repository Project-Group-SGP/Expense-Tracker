import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { profile } from "console";

const handle = NextAuth({
  providers:[
    CredentialsProvider({
      name:'Email',
      credentials: {
        Email: { label: "email", type: "text", placeholder: "email" },
        Password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
  
        // If no error and we have user data, return it
          return {
            id: "testing"
          }
        // Return null if user data could not be retrieved
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
  secret:process.env.NEXT_AUTH_SECRET,
  pages:{
    signIn:'/signin'
  },
  session:{
    strategy:'jwt'
  },
  callbacks:{
    async signIn({ user, account, profile, email, credentials }) {
      
      return true
    },
  }
});
export const GET = handle;
export const POST = handle;