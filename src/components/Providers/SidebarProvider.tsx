"use client"

import React, { createContext, useContext, useState } from "react"

type SidebarContextType = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

type SidebarProviderProps = {
  children: React.ReactNode
  navbar: React.ReactNode
}

export function SidebarProvider({ children, navbar }: SidebarProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState)
  }

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {navbar}
      <main
        className={`${isSidebarOpen ? "pointer-events-none select-none blur-sm md:pointer-events-auto md:select-auto md:blur-none" : ""}`}
      >
        {children}
      </main>
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
