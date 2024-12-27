"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function RecurringButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleClick = () => {
    startTransition(() => {
      router.push("/recurring")
    })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className="w-full border-green-500 text-green-500 hover:bg-green-700 hover:text-white sm:w-auto sm:px-4 sm:py-2 md:w-[150px]"
      variant="outline"
    >
      {isPending ? "Redirecting... 🕰️" : "New Recurring ⏳"}
    </Button>
  )
}
