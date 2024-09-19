"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState, useEffect } from "react"

const LABEL_MAP: Record<string, string> = {
  Other: "Other",
  Bills: "Bills",
  Food: "Food",
  Entertainment: "Entertainment",
  Transportation: "Transportation",
  EMI: "EMI",
  Healthcare: "Healthcare",
  Education: "Education",
  Investment: "Investment",
  Shopping: "Shopping",
  Fuel: "Fuel",
  Groceries: "Groceries",
  Income: "Income",
}

export default function CategoryDropdown({
  id,
  changeCategory,
  amount,
  initialCategory,
}: {
  id: number
  changeCategory: (id: number, category: string) => void
  amount: number
  initialCategory: string
}) {
  const [selectedStatus, setSelectedStatus] = useState(initialCategory)
  const isIncome = amount > 0

  useEffect(() => {
    setSelectedStatus(initialCategory)
  }, [initialCategory])

  const handleClick = (e: React.MouseEvent) => {
    if (isIncome) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const dropdownOptions = isIncome
    ? { Income: "Income" }
    : Object.fromEntries(
        Object.entries(LABEL_MAP).filter(([key]) => key !== "Income")
      )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={handleClick}>
        <Button
          variant="outline"
          className="flex w-44 items-center justify-between"
        >
          {LABEL_MAP[selectedStatus]}
          {selectedStatus !== "Income" && (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </DropdownMenuTrigger>
      {!isIncome && (
        <DropdownMenuContent className="h-52 w-44 p-0">
          <ScrollArea className="h-52">
            {Object.entries(dropdownOptions).map(([key, value]) => (
              <DropdownMenuItem
                key={key}
                className={cn(
                  "flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100",
                  {
                    "bg-zinc-100 dark:bg-zinc-700": key === selectedStatus,
                  }
                )}
                onClick={() => {
                  changeCategory(id, key)
                  setSelectedStatus(key)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 text-primary",
                    selectedStatus === key ? "opacity-100" : "opacity-0"
                  )}
                />
                {value}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
