"use client"

import React from "react"
import { ThemeProviders } from "./ThemeProvider"
import { SessionProviders } from "./SessionProvider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <SessionProviders>
      <QueryClientProvider client={queryClient}>
        <ThemeProviders
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProviders>
      </QueryClientProvider>
    </SessionProviders>
  )
}
