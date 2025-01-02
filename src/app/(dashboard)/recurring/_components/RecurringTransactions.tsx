"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Edit,
  Trash2,
  ChevronDown,
  Info,
  ChevronLeft,
  ChevronRight,
  Bell,
  BellOff,
} from "lucide-react"
import { RecurringTransaction } from "./types"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { setReminderStatus } from "../action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface RecurringTransactionsProps {
  initialTransactions: RecurringTransaction[]
  onEdit: (transaction: RecurringTransaction) => void
  onDelete: (id: string) => void
  update_Transactions: (transactions: RecurringTransaction[]) => void
}

type ColumnVisibility = {
  amount: boolean
  category: boolean
  frequency: boolean
  nextOccurrence: boolean
  description: boolean
}

export const RecurringTransactions: React.FC<RecurringTransactionsProps> = ({
  initialTransactions: transactions,
  update_Transactions,
  onEdit,
  onDelete,
}) => {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    amount: true,
    category: true,
    frequency: true,
    nextOccurrence: true,
    description: true,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const route = useRouter()

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility((prev) => ({ ...prev, [column]: !prev[column] }))
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  const handleReminderToggle = async (id: string, enabled: boolean) => {
    console.log(
      `Reminder for transaction ${id} ${enabled ? "enabled" : "disabled"}`
    )

    try {
      // Send a request to the server to update the reminder status
      const response = await setReminderStatus(id, enabled)
      route.refresh()
      if (response === true) {
        update_Transactions(
          transactions.map((transaction) => {
            if (transaction.id === id) {
              return { ...transaction, reminderEnabled: enabled }
            }
            return transaction
          })
        )

        toast.success(
          `Reminder ${enabled ? "enabled" : "disabled"} successfully`,
          {
            closeButton: true,
            icon: enabled ? "🔔" : "🔕",
            duration: 4500,
          }
        )
      } else {
        toast.error("Failed to update reminder status", {
          closeButton: true,
          icon: "❌",
          duration: 4500,
        })
      }
    } catch (error) {
      toast.error("Failed to update reminder status", {
        closeButton: true,
        icon: "❌",
        duration: 4500,
      })
      console.error("Failed to update reminder status:", error)
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case "daily":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "weekly":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "monthly":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "yearly":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Recurring Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm">
              Total: {transactions.length}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(columnVisibility).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={value}
                    onCheckedChange={() =>
                      toggleColumn(key as keyof ColumnVisibility)
                    }
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">Title</TableHead>
                  {columnVisibility.amount && (
                    <TableHead className="text-right">Amount</TableHead>
                  )}
                  {columnVisibility.category && <TableHead>Category</TableHead>}
                  {columnVisibility.frequency && (
                    <TableHead>Frequency</TableHead>
                  )}
                  {columnVisibility.nextOccurrence && (
                    <TableHead>Next Occurrence</TableHead>
                  )}
                  {columnVisibility.description && (
                    <TableHead className="hidden md:table-cell">
                      Description
                    </TableHead>
                  )}
                  <TableHead className="text-center">Reminder</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {transaction.title}
                    </TableCell>
                    {columnVisibility.amount && (
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            transaction.type === "INCOME"
                              ? "primary"
                              : "destructive"
                          }
                          className={`font-mono ${
                            transaction.type === "INCOME"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          ₹{transaction.amount.toFixed(2)}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.category && (
                      <TableCell>
                        <Badge variant="secondary">
                          {transaction.category == null
                            ? "Income"
                            : transaction.category}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.frequency && (
                      <TableCell>
                        <Badge
                          className={`${getFrequencyColor(transaction.frequency)}`}
                        >
                          {transaction.frequency === "CUSTOM"
                            ? `${transaction.customInterval} days`
                            : transaction.frequency}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.nextOccurrence && (
                      <TableCell>
                        {new Date(
                          transaction.nextOccurrence
                        ).toLocaleDateString()}
                      </TableCell>
                    )}
                    {columnVisibility.description && (
                      <TableCell className="hidden max-w-[200px] md:table-cell">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="cursor-help">
                              <div className="flex items-center">
                                <span className="mr-1 truncate">
                                  {truncateText(
                                    transaction.description || "",
                                    30
                                  )}
                                </span>
                                {transaction.description &&
                                  transaction.description.length > 30 && (
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="max-w-xs">
                                {transaction.description}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    )}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={transaction.reminderEnabled}
                          onCheckedChange={(checked) =>
                            handleReminderToggle(transaction.id, checked)
                          }
                          className="data-[state=checked]:bg-green-500"
                        />
                        <span className="sr-only">
                          {transaction.reminderEnabled
                            ? "Disable reminder"
                            : "Enable reminder"}
                        </span>
                        {transaction.reminderEnabled ? (
                          <Bell className="h-4 w-4 text-green-500" />
                        ) : (
                          <BellOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between bg-muted/10 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
