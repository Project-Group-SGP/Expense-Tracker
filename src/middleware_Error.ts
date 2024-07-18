// import NextAuth from "next-auth"
// import authConfig from "./auth.config"
// import { getSession } from 'next-auth/react';
// import {
//   DEFAULT_LOGIN_REDIRECT,
//   apiAuthPrefix,
//   authRoutes,
//   publicRoutes
// } from '@/routes'
// import { NextRequest } from "next/server";

// export const { auth:middleware } = NextAuth(authConfig);

// export default auth(async function middleware(req:NextRequest) {
//   console.log(req);
//   const session = await getSession({ req });

//   if (!session) {
//     // If the user is not logged in, redirect them to the login page
//     console.log("\n\nNOT LOGED IN\n\n")
//   }
//   const {nextUrl} = req;
//   const isLoggedIn = !!req.auth;

//   console.log("Loged in:",isLoggedIn);

//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  
//   const isPublic = publicRoutes.includes(nextUrl.pathname);
  
//   const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

//   if(isApiAuthRoute) return null;

//   if(isAuthRoutes){
//     if(isLoggedIn){
//       return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
//     }
//     return null;
//   }
  
//   if(!isLoggedIn && !isPublic){
//     return Response.redirect(new URL("/auth/login",nextUrl))
//   }  
  
//   return null;
  
// })


// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// }

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getSession } from 'next-auth/react';
import { 
  DEFAULT_LOGIN_REDIRECT, 
  apiAuthPrefix, 
  authRoutes, 
  publicRoutes 
} from '@/routes';
import { NextRequest, NextResponse } from "next/server";

export const { auth: middleware } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
  const session = await getSession({ req });

  if (!session) {
    console.log("\n\nNOT LOGGED IN\n\n");
  }

  const nextUrl = req.nextUrl;
  const isLoggedIn = !!session;

  console.log("Logged in:", isLoggedIn);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  const isPublic = publicRoutes.includes(nextUrl.pathname);

  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthRoutes) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
