import NextAuth,{type DefaultSession} from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  isTwoFactorEnabled :boolean;
  isOAuth:boolean;
}

declare module "next-auth" {
  interface Session{
    user:ExtendedUser;
  }
}