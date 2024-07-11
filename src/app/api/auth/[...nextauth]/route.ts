"use server"
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const handle = NextAuth({
  providers:[
    CredentialsProvider({
      name:'Email',
      credentials: {
        Email: { label: "email", type: "text", placeholder: "email" },
        Password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        
          return {
            id: "testing"
          }        
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
      return true;
    },
    async redirect({url, baseUrl}) {
      console.log('url', url);
      console.log('baseUrl', baseUrl);
      return baseUrl;
    }
  }
});
export const GET = handle;
export const POST = handle;