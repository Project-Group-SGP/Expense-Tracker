"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function TransactionButtons() {
  const router = useRouter()

  const handleImport = () => {
    router.push("/transaction"); 
  }

  const handleExport = () => {
    router.push("/report");  
  }

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
      <Button
        className="w-full border-blue-500 text-blue-500 hover:bg-blue-700 hover:text-white sm:w-[150px]"
        variant="outline"
        onClick={handleImport}
      >
        Import 📥
      </Button>
      <Button
        className="w-full border-purple-500 text-purple-500 hover:bg-purple-700 hover:text-white sm:w-[150px]"
        variant="outline"
        onClick={handleExport}
      >
        Report 📤
      </Button>
    </div>
  )
}