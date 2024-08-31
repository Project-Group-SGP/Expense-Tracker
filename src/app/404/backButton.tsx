"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
    >
      <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
    </Button>
  )
}
