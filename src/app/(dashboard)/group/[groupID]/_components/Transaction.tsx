'use client'

import React, { useState } from "react"
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
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

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
  expenseSplits: ExpenseSplit[]
}

export default function Transaction({ transactionsData }: { transactionsData: Transaction[] }) {
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null)
  
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

  return (
    <Card className="w-full max-w-4xl mx-auto bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption className="text-muted-foreground">A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionsData.map((transaction) => (
              <React.Fragment key={transaction.expenseId}>
                <TableRow className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className="text-right font-semibold">₹ {transaction.amount}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSplitClick(transaction.expenseId)}
                      className="flex items-center gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-colors duration-200"
                    >
                      {selectedExpense === transaction.expenseId ? (
                        <>
                          Hide Splits
                          <ChevronUpIcon className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Show Splits
                          <ChevronDownIcon className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>

                {selectedExpense === transaction.expenseId && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg mt-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">User ID</TableHead>
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
                                <TableCell className="text-right font-semibold">₹ {split.amount}</TableCell>
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
      </CardContent>
    </Card>
  )
}