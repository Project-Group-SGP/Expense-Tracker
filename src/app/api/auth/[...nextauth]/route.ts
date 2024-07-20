"use server"
// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials"
// import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook";

// const handle = NextAuth({
//   providers:[
//     CredentialsProvider({
//       name:'Email',
//       credentials: {
//         Email: { label: "email", type: "text", placeholder: "email" },
//         Password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials, req) {
        
//           return {
//             id: "testing"
//           }        
//       }
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID||"",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET||""
//     }),
//     FacebookProvider({
//       clientId: process.env.FACEBOOK_CLIENT_ID||"",
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET||""
//     })
//   ],
//   secret:process.env.NEXT_AUTH_SECRET,
//   pages:{
//     signIn:'/auth/signin',
//     error:'/auth/error'
//   },
//   session:{
//     strategy:'jwt'
//   },
//   callbacks:{
//     async signIn({ user, account, profile, email, credentials }) {
//       return true;
//     },
//     async redirect({url, baseUrl}) {
//       console.log('url', url);
//       console.log('baseUrl', baseUrl);
//       return baseUrl;
//     }
//   }
// });
// export const GET = handle;
// export const POST = handle;

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { getTwoFactorConformationByUserId } from "@/data/two-factor-conformation";
import CredentialsProvider from "next-auth/providers/credentials"
import { SigninSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user";
import bcrypt  from "bcryptjs"
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";


export const {handle,auth,signIn,signOut} = NextAuth({
  adapter:PrismaAdapter(db),

  session: { strategy: "jwt" },
  events:{
    async linkAccount({user}){
      await db.user.update({
        where:{id:user.id},
        data:{emailVerified:new Date()}
      });
    },
  },
  callbacks:{
    // Modify the jwt token / Action to take while generation of token
    async jwt({token}){
      // token.sub has user id (USER table id ) 
      if(!token.sub)
        return token;

      const existingUser = await  getUserById(token.sub);

      if(!existingUser) return token;

      token.isTwoFactorEnable = existingUser.isTwoFactorEnable;

      return token;

    },
    //Modify the session / Action to take while generation of session
    async session({token,session}){
      console.log({Sessiontoken:token,session});
      // id of our user is in token.sub 

      if(token.sub && session.user) 
        session.user.id = token.sub;
      

      if(session.user)
        session.user.isTwoFactorEnable = token.isTwoFactorEnable as boolean;   
    },

    // Action to tack when user signin/login
    async signIn({user,account}){
      // Allow OAuth without email verification
      if(account?.provider!="credentials") return true;      

      const existingUser = await getUserById(user.id||"");


      //Prevent sign in without email verification
      if(!existingUser||!existingUser.emailVerified)
        return false;  


      //Todo :ADD 2Factor Authencation check
      if(!existingUser?.isTwoFactorEnable){
        const twoFactorConfirmation = await getTwoFactorConformationByUserId(existingUser.id);
     

        if(!twoFactorConfirmation) return false;

        //Delete two factor conformation for next sign in
        await db.twoFactorConfirmation.delete({
          where:{
            id:twoFactorConfirmation.id
          }
        });
      }
      return true;
    }
  },

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

  
  pages:{
    signIn:"/auth/login",

    // IF any Error comes During OAuth Then Redirect to this page.
    error:"/auth/error"
  }
})

export const GET = handle;
export const POST = handle;


// import { handlers } from "@/auth"
// export const { GET, POST } = handlers