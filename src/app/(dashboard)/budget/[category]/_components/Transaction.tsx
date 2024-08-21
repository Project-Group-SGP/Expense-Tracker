"use client"
import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IndianRupee } from "lucide-react"
import { usePathname } from "next/navigation"

type Expense = {
  id: string
  userId: string
  category: string
  amount: string
  date: string
  description: string
}

export type Expenses = Expense[]

const Transaction = ({ data }: { data: Expenses }) => {
  const pathname = usePathname()
  const lastRouteName = pathname?.split("/").pop()?.toUpperCase() || ""

  const categoryTransaction: {
    id: string
    category: string
    date: string
    description: string | null
    amount: string
  }[] = []

  // Filter data  category wise
  const filteredData = data.filter(
    (transaction) =>
      transaction.category.toUpperCase() === lastRouteName
  )

  filteredData.forEach((transaction) => {
    categoryTransaction.push({
      id: transaction.id,
      category: transaction.category,
      date: transaction.date,
      description: transaction.description || null,
      amount: transaction.amount
    })
  })

  //total amount
  const totalAmount = categoryTransaction.reduce((total, transaction) => {
    return total + parseFloat(transaction.amount)
  }, 0)

  let i = 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{lastRouteName}</CardTitle>
        <CardDescription>
          All {lastRouteName} Transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your {lastRouteName} transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryTransaction.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{i++}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.description || '-'}</TableCell>
                <TableCell className="text-right">
                  {transaction.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                {`₹${totalAmount.toFixed(2)}`}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}

export default Transaction
