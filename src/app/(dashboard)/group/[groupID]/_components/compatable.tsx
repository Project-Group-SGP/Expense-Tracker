"use client"
import React from "react"
import {  useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Compatable({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
    <Button
      variant="outline"
      className="w-full sm:w-auto"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {isExpanded ? 'Hide Options' : 'Show Options'}
    </Button>
    <div className={cn(
      "flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0",
      isExpanded ? "block" : "hidden sm:flex"
    )}>
      {children}
    </div>
  </div>
}