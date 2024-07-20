import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { getSession } from 'next-auth/react';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from '@/routes'

const { auth } = NextAuth(authConfig);


export default auth((req):any=> {
  
  const {nextUrl} = req;
  const isLoggedIn = !!req.auth;

  console.log("Loged in:",isLoggedIn);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  
  const isPublic = publicRoutes.includes(nextUrl.pathname);
  
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

  if(isApiAuthRoute) return null;

  if(isAuthRoutes){
    if(isLoggedIn){
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
    }
    return null;
  }
  
  if(!isLoggedIn && !isPublic){
    return Response.redirect(new URL("/auth/signin",nextUrl))
  }  
  
  return null;
  
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  // matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}