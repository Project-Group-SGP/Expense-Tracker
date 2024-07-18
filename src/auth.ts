import NextAuth ,{type DefaultSession} from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { getTwoFactorConformationByUserId } from "./data/two-factor-conformation";
 
export const { handlers, auth, signIn, signOut } = NextAuth({
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

      // if(token.sub && session.user) 
      //   session.user.id = token.sub;
      

      // if(session.user)
      //   session.user.isTwoFactorEnable = token.isTwoFactorEnable as boolean;   
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
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },

  ...authConfig,

  
  pages:{
    signIn:"/auth/login",

    // IF any Error comes During OAuth Then Redirect to this page.
    error:"/auth/error"
  }
})