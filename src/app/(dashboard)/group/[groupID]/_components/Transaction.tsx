'use client'

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronDownIcon, ChevronUpIcon, XIcon, ArrowUpDown } from "lucide-react"
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
import { ChevronDown, ChevronUp } from 'lucide-react';
import TransactionTableSkeleton from "./TransactionSkeleton"
import { number } from "zod"

interface ExpenseSplit {
  userName: string
  expenseId: string
  amount: number 
  isPaid: 'PAID' | 'UNPAID' | 'PARTIALLY_PAID' 
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
  { id: 'date', label: 'Date', sortable: true },
  { id: 'description', label: 'Description', sortable: false },
  { id: 'category', label: 'Category', sortable: false },
  { id: 'paidBy', label: 'Paid By', sortable: false },
  { id: 'amount', label: 'Amount', sortable: true },
  { id: 'status', label: 'Status', sortable: false },
  { id: 'action', label: 'View split', sortable: false },
]
  
export default function Transaction({ transactionsData, loading }: { transactionsData: Transaction[], loading: boolean }) {
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null)
  const [showDetailed, setShowDetailed] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState(columns.map(col => col.id))
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null)

  const handleSplitClick = (expenseId: string) => {
    setSelectedExpense(selectedExpense === expenseId ? null : expenseId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredTransactions = useMemo(() => {
    if (!transactionsData) return []
    let filtered = showDetailed 
      ? transactionsData 
      : transactionsData.filter(t => t.status !== "SETTLED")

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
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
    setSelectedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    )
  }

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  if (loading) {
    return <TransactionTableSkeleton />;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Transactions</CardTitle>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="detailed-view"
              checked={showDetailed}
              onCheckedChange={setShowDetailed}
            />
            <label htmlFor="detailed-view" className="text-sm font-medium text-muted-foreground">
              Show Cleared Transactions
            </label>
          </div>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-colors duration-200"
              >
                Simple View
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium mb-1">Select columns</h4>
                {columns.map(column => (
                  <div
                    key={column.id}
                    className={`flex items-center justify-between p-1 text-sm rounded-sm cursor-pointer transition-colors ${
                      selectedColumns.includes(column.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
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
                    className="text-xs px-2 py-1"
                    onClick={() => setSelectedColumns([])}
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1"
                    onClick={() => setSelectedColumns(columns.map(col => col.id))}
                  >
                    Select All
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                selectedColumns.includes(column.id) && (
                  <TableHead key={column.id} className={column.id === 'amount' ? 'text-right' : ''}>
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => requestSort(column.id)}
                        className={`flex items-center ${column.id === 'amount' ? 'justify-end w-full' : ''}`}
                      >
                        {column.label}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                )
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length===0 && (
              <TableCell colSpan={7} className="h-24 mt-4 w-full text-center">
                No results.
              </TableCell>
            )}
            {paginatedTransactions.length!==0 && paginatedTransactions.map((transaction) => (
              <React.Fragment key={transaction.expenseId}>
                <TableRow className="hover:bg-muted/50 transition-colors">
                  {selectedColumns.includes('date') && (
                    <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                  )}
                  {selectedColumns.includes('description') && (
                    <TableCell>{transaction.description.length<10? transaction.description:transaction.description.slice(0,9)+".."}</TableCell>
                  )}
                  {selectedColumns.includes('category') && (
                    <TableCell>{transaction.category}</TableCell>
                  )}
                  {selectedColumns.includes('paidBy') && (
                    <TableCell>{transaction.PaidByName}</TableCell>
                  )}
                  {selectedColumns.includes('amount') && (
                    <TableCell className="text-right font-semibold">₹ {Number(transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  )}
                  {selectedColumns.includes('status') && (
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === "SETTLED"
                            ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : transaction.status === "PARTIALLY_SETTLED"? "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100":"bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-100" 
                        }`}
                      >
                        {transaction.status==="SETTLED" && "Cleared"}
                        {transaction.status==="PARTIALLY_SETTLED" && "Partial"}
                        {transaction.status==="UNSETTLED" && "Pending"}
                      </span>
                    </TableCell>
                  )}
                  {selectedColumns.includes('action') && (
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSplitClick(transaction.expenseId)}
                      className="flex items-center gap-1 p-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-colors duration-200 rounded-md"
                      >
                        {selectedExpense === transaction.expenseId ? (
                          <>
                            <ChevronUp size={16} />
                            <span className="text-xs font-medium">Hide</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} />
                            <span className="text-xs font-medium">Show</span>
                          </>
                        )}
                      </Button>
                  </TableCell>
                  )}
                </TableRow>
                {selectedColumns.includes('action') && selectedExpense === transaction.expenseId && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg mt-2 w-full">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">User Name</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transaction.expenseSplits.map((split, index) => (
                              <TableRow key={index} className="hover:bg-muted/70 dark:hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium">{split.userName}</TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      split.isPaid === "PAID"
                                        ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-100"
                                        : "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                    }`}
                                  >
                                    {split.isPaid}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right font-semibold">₹ {Number(split.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                              </TableRow>
                            ))}
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
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Page {currentPage} of {pageCount}</span>
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
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}