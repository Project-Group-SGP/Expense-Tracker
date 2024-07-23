import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "./auth.config"
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes"

const { auth } = NextAuth(authConfig)

export default auth((req): any => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return null
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }

  if(!isLoggedIn && !isPublicRoute){
    let callbackUrl = nextUrl.pathname;
    if(nextUrl.search){
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(new URL("/auth/login?callbackUrl="+encodedCallbackUrl,nextUrl))
  }  

  const routeExists =
  isApiAuthRoute ||
  isPublicRoute ||
  isAuthRoute ||
  nextUrl.pathname === DEFAULT_LOGIN_REDIRECT

if (!routeExists) {
  return NextResponse.redirect(new URL("/404", nextUrl))
}


  return null
})

export const config = {
  matcher: ["/((?!.*\\..*|_next|404).*)", "/", "/(api|trpc)(.*)"],
}
