import NextAuth,{type DefaultSession} from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  isTwoFactorEnable :boolean;
  isOAuth:boolean;
  joininDate:string;
}

declare module "next-auth" {
  interface Session{
    user:ExtendedUser;
  }
}