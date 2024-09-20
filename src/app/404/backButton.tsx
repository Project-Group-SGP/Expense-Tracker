"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BackButton({ className }: { className: string }) {
  const router = useRouter()
  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      className={cn(
        "w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800",
        className
      )}
    >
      <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
    </Button>
  )
}
