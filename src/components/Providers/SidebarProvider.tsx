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
  sidebar?: React.ReactNode
}

export function SidebarProvider({
  children,
  navbar,
}: SidebarProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState)
  }

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {/* <div className="flex min-h-screen flex-col"> */}
        {navbar}
          <main
            className={`${isSidebarOpen ? "blur-sm md:blur-none" : ""}`}
          >
            {children}
          </main>
        {/* </div> */}
      {/* </div> */}
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
