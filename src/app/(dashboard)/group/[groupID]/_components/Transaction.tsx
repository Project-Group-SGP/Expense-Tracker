"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XIcon,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Trash2,
  User,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronUp } from "lucide-react"
import TransactionTableSkeleton from "./TransactionSkeleton"
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
import DeleteGroupTransactionButton from "./delete-group-transaction-button"

interface ExpenseSplit {
  userName: string
  expenseId: string
  amount: number
  isPaid: "PAID" | "UNPAID" | "PARTIALLY_PAID"
}

interface Transaction {
  groupId: string
  expenseId: string
  amount: number
  category: string
  paidById: string
  description: string
  date: string
  status: "UNSETTLED" | "PARTIALLY_SETTLED" | "SETTLED" | "CANCELLED"
  PaidByName: string
  expenseSplits: ExpenseSplit[]
}

const columns = [
  { id: "date", label: "Date", sortable: true },
  { id: "description", label: "Description", sortable: false },
  { id: "category", label: "Category", sortable: false },
  { id: "paidBy", label: "Paid By", sortable: false },
  { id: "amount", label: "Amount", sortable: true },
  { id: "status", label: "Status", sortable: false },
  { id: "action", label: "Action", sortable: false },
]

export default function Transaction({
  transactionsData,
  loading,
  userId,
}: {
  transactionsData: Transaction[]
  loading: boolean
  userId: string
}) {
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null)
  const [showDetailed, setShowDetailed] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState(
    columns.map((col) => col.id)
  )
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  } | null>(null)

  const handleSplitClick = (expenseId: string) => {
    setSelectedExpense(selectedExpense === expenseId ? null : expenseId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const filteredTransactions = useMemo(() => {
    if (!transactionsData) return []
    let filtered = showDetailed
      ? transactionsData
      : transactionsData.filter((t) => t.status !== "SETTLED")

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [transactionsData, showDetailed, sortConfig])

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredTransactions, currentPage, itemsPerPage])

  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage)

  const toggleColumn = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    )
  }

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  if (loading) {
    return <TransactionTableSkeleton />
  }
  return (
    <Card className="mx-auto w-full max-w-4xl bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Transactions
        </CardTitle>
        <div className="mt-0 flex flex-row items-start justify-between space-y-2 sm:mt-4 sm:items-center sm:space-y-0">
          <div className="mt-4 flex h-full items-center space-x-2 text-center sm:mt-0">
            <Switch
              id="detailed-view"
              checked={showDetailed}
              onCheckedChange={setShowDetailed}
              className="items-center"
            />
            <label
              htmlFor="detailed-view"
              className="hidden items-center text-sm font-medium text-muted-foreground sm:block"
            >
              Show Cleared Transactions
            </label>
            <label
              htmlFor="detailed-view"
              className="block items-center text-sm font-medium text-muted-foreground sm:hidden"
            >
              Show
            </label>
          </div>
          <div className="hidden sm:block">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="mt-0 border-primary/20 bg-primary/10 text-primary transition-colors duration-200 hover:border-primary/30 hover:bg-primary/20 hover:text-primary"
              >
                Simple View
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="space-y-2">
                <h4 className="mb-1 text-sm font-medium">Select columns</h4>
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className={`flex cursor-pointer items-center justify-between rounded-sm p-1 text-sm transition-colors ${
                      selectedColumns.includes(column.id)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => toggleColumn(column.id)}
                  >
                    <span>{column.label}</span>
                    {selectedColumns.includes(column.id) && (
                      <XIcon className="h-3 w-3" />
                    )}
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 py-1 text-xs"
                    onClick={() => setSelectedColumns([])}
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 py-1 text-xs"
                    onClick={() =>
                      setSelectedColumns(columns.map((col) => col.id))
                    }
                  >
                    Select All
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          </div>
          <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                      variant="outline"
                      className="mt-0 w-full border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary transition-colors duration-200 hover:border-primary/30 hover:bg-primary/20 hover:text-primary sm:w-auto sm:text-base"
                    >
                      Simple View
                </Button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={selectedColumns.filter(col=> col === column.id).length===1 }
                    onCheckedChange={(value) =>
                      toggleColumn(column.id)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(
                  (column) =>
                    selectedColumns.includes(column.id) && (
                      <TableHead
                        key={column.id}
                        className={`${column.id === "amount" ? "text-right" : ""}`}
                      >
                        {column.sortable ? (
                          <Button
                            variant="ghost"
                            onClick={() => requestSort(column.id)}
                            className={`flex items-center ${column.id === "amount" ? "w-full justify-end" : ""}`}
                          >
                            {column.label}
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          column.label
                        )}
                      </TableHead>
                    )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
              {paginatedTransactions.length !== 0 &&
                paginatedTransactions.map((transaction) => (
                  <React.Fragment key={transaction.expenseId}>
                    <TableRow className="transition-colors hover:bg-muted/50">
                      {selectedColumns.includes("date") && (
                        <TableCell className="font-medium">
                          {formatDate(transaction.date)}
                        </TableCell>
                      )}

                      {selectedColumns.includes("description") && (
                        <TableCell>
                          {transaction.description.length <= 10 ? (
                            transaction.description
                          ) : (
                            <TooltipProvider>
                              <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                                  <div className="flex cursor-pointer items-center space-x-1">
                                    <span className="max-w-[150px] truncate">
                                      {transaction.description.slice(0,10)}
                                    </span>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs p-2 bg-white text-black z-10 dark:bg-gray-950 dark:text-white">
                                  <p className="text-sm">
                                    {transaction.description}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </TableCell>
                      )}
                      {selectedColumns.includes("category") && (
                        <TableCell>{transaction.category}</TableCell>
                      )}
                      {selectedColumns.includes("paidBy") && (
                        <TableCell>{transaction.PaidByName}</TableCell>
                      )}
                      {selectedColumns.includes("amount") && (
                        <TableCell className="text-right font-semibold">
                          {formatAmount(transaction.amount)}
                        </TableCell>
                      )}
                      {selectedColumns.includes("status") && (
                        <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              transaction.status === "SETTLED"
                                ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : transaction.status === "PARTIALLY_SETTLED"
                                  ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                  : "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {transaction.status === "SETTLED" && "Cleared"}
                            {transaction.status === "PARTIALLY_SETTLED" &&
                              "Partial"}
                            {transaction.status === "UNSETTLED" && "Pending"}
                          </span>
                        </TableCell>
                      )}
                      {selectedColumns.includes("action") && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                          <DeleteGroupTransactionButton groupId={transaction.groupId as string} transactionId={transaction.expenseId as string}  isCreator={transaction.paidById === userId ? true : false } canDelete={transaction.expenseSplits.filter(split => split.isPaid === "PAID").length === 1}/>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleSplitClick(transaction.expenseId)
                            }
                            className="flex items-center gap-1 rounded-md border-primary/20 bg-primary/10 p-1 text-primary transition-colors duration-200 hover:border-primary/30 hover:bg-primary/20 hover:text-primary"
                          >
                            {selectedExpense === transaction.expenseId ? (
                              <>
                                <ChevronUp size={16} />
                                <span className="text-xs font-medium">
                                  Hide
                                </span>
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} />
                                <span className="text-xs font-medium">
                                  Show
                                </span>
                              </>
                            )}
                          </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                    {selectedColumns.includes("action") &&
                      selectedExpense === transaction.expenseId && (
                        <TableRow>
                          <TableCell colSpan={7} className="p-0">
                            <div className="mt-2 w-full overflow-x-auto rounded-lg bg-muted/50 p-4 dark:bg-muted/20">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[200px]">
                                      User Name
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                      Amount
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {transaction.expenseSplits.map(
                                    (split, index) => (
                                      <TableRow
                                        key={index}
                                        className="transition-colors hover:bg-muted/70 dark:hover:bg-muted/30"
                                      >
                                        <TableCell className="font-medium">
                                          {split.userName}
                                        </TableCell>
                                        <TableCell>
                                          <span
                                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                              split.isPaid === "PAID"
                                                ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                : "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                            }`}
                                          >
                                            {split.isPaid}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                          {formatAmount(split.amount)}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4 sm:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
        <div className="hidden flex-row items-center justify-between space-x-2 space-y-0 py-4 sm:flex">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              Page {currentPage} of {pageCount}
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
