"use client"

import React from "react"
import { ThemeProviders } from "./ThemeProvider"
import { SessionProviders } from "./SessionProvider"

export function Providers({children}: {children:React.ReactNode}) {

  return <SessionProviders>
    <ThemeProviders
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
      {children}
    </ThemeProviders>
  </SessionProviders>
}
