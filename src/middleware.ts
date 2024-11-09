import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "./auth.config"
import {
  apiAuthPrefix,
  apiRoutes,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  privateRoutes,
  publicRoutes,
} from "./routes"

const { auth } = NextAuth(authConfig)

export default auth((req): any => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isApiRoute = apiRoutes.includes(nextUrl.pathname)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname)
  const isGroupRoute = nextUrl.pathname.startsWith("/group/")

  const routeExists =
    isApiAuthRoute ||
    isPublicRoute ||
    isAuthRoute ||
    isPrivateRoute ||
    isApiRoute ||
    isGroupRoute ||
    nextUrl.pathname === DEFAULT_LOGIN_REDIRECT

  if (!routeExists) {
    return NextResponse.redirect(new URL("/404", nextUrl))
  }

  if (isApiAuthRoute) {
    return null
  }

  if (isApiRoute && isLoggedIn) {
    return NextResponse.next()
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }

  if (!isLoggedIn && (isGroupRoute || (!isPublicRoute && !isGroupRoute))) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(
      new URL("/auth/login?callbackUrl=" + encodedCallbackUrl, nextUrl)
    )
  }
  return null
})

export const config = {
  matcher: ["/((?!.*\\..*|_next|404).*)", "/", "/(api|trpc)(.*)"],
}
