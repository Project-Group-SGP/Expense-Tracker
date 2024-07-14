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
import { CategoryTypes } from "@prisma/client"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

const LABEL_MAP: Record<string, keyof typeof CategoryTypes> = {
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
}

export default function CategoryDropdown({
  id,
  changeCategory,
}: {
  id: number
  changeCategory: (id: number, category: string) => void
}) {
  const initialStatus = Object.keys(LABEL_MAP)[0]
  const [selectedStatus, setSelectedStatus] = useState(initialStatus)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-44 items-center justify-between"
        >
          {LABEL_MAP[selectedStatus]}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="h-52 w-44 p-0">
        <ScrollArea className="h-52">
          {Object.keys(LABEL_MAP).map((status) => (
            <DropdownMenuItem
              key={status}
              className={cn(
                "flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100",
                {
                  "bg-zinc-100 dark:bg-slate-500": status === selectedStatus,
                }
              )}
              onClick={() => {
                changeCategory(id, status)
                setSelectedStatus(status)
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4 text-primary",
                  selectedStatus === status ? "opacity-100" : "opacity-0"
                )}
              />
              {LABEL_MAP[status]}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
