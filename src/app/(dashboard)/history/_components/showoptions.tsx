"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Download, Upload } from "lucide-react"
import { useState } from "react"
import PageTitle from "./PageTitle"
import DatePicker from "./DatePicker"
import { Newincome } from "./Income"
import { NewExpense } from "./Expance"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export const Showoptions = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const router = useRouter()

  const handleImport = () => router.push("/transaction")
  const handleExport = () => router.push("/report")

  return (
    <>
      <div className="flex w-full flex-col items-start justify-between gap-5 space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <PageTitle title="Transaction History" />
        <Button
          variant="outline"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:hidden"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              Hide Options
              <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show Options
              <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {/* Mobile view */}
      <div
        className={cn(
          "flex flex-col space-y-4 transition-all duration-300 ease-in-out sm:hidden",
          isExpanded
            ? "max-h-[500px] opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        )}
      >
        <div className="flex justify-around gap-4 rounded-lg bg-card p-4 shadow-md">
          <Newincome />
          <NewExpense />
        </div>
        <div className="flex justify-around gap-4 rounded-lg bg-card p-4 shadow-md">
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleImport}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Tablet/Desktop view */}
      <div className="mt-6 w-full flex-col items-start justify-end gap-4 sm:flex md:flex-row md:items-center">
        <div className="mt-4 w-full">
          <DatePicker />
        </div>
        <div className="mt-4 hidden gap-2 sm:flex">
          <Newincome />
          <NewExpense />
        </div>
      </div>
    </>
  )
}
