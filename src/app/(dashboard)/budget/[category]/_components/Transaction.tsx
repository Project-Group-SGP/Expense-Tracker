import React, { useCallback, useEffect, useState } from "react"
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
import { usePathname } from "next/navigation"
import { AlertCircle, Wallet, X } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button" // Corrected Button import
import Card_budget from "./Card_budget"
import { SetCategory_Budget } from "./SetCategory_Budget"


type Expense = {
  id: string
  userId?: string
  category: string
  amount: string
  date: string
  description: string
}

export type Expenses = Expense[]

const Transaction = ({
  data,
}: {
  data: { expenses: Expenses; categoryBudget: any; budget:number }
}) => {
  const pathname = usePathname()
  const lastRouteName = pathname?.split("/").pop()?.toUpperCase() || ""

  const [toastShown, setToastShown] = useState(false)

  // Filter data category-wise
  const filteredData =
    data.expenses?.filter(
      (transaction) => transaction.category.toUpperCase() === lastRouteName
    ) || []

  const categoryTransaction = filteredData.map((transaction) => ({
    id: transaction.id,
    category: transaction.category,
    date: transaction.date,
    description: transaction.description || null,
    amount: transaction.amount,
  }))

  // Total amount calculation
  const totalAmount = categoryTransaction.reduce((total, transaction) => {
    return total + parseFloat(transaction.amount)
  }, 0)

  // Function to show the warning toast
  const showWarningToast = useCallback(() => {
    toast.custom(
      (t) => (
        <Alert className="relative w-full max-w-md border-none border-red-800 bg-red-600 shadow-lg">
          <AlertTitle className="flex items-center text-[13px] font-bold text-white">
            <AlertCircle className="mr-2 h-6 w-6 text-red-200" />
            Warning: {lastRouteName} Budget Exceeded!
          </AlertTitle>
          <AlertDescription className="mt-2 text-[12px] text-red-100">
            You've exceeded your budget! Please review your expenses.
          </AlertDescription>
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-2 top-2 text-red-100 hover:bg-red-700 hover:text-white"
            onClick={() => toast.dismiss(t)}
          >
            <X className="h-5 w-5" />
          </Button>
        </Alert>
      ),
      {
        duration: 5000,
        position: "top-right",
      }
    )
    setToastShown(true)
  }, [])

  // Use effect to trigger the toast when the total amount exceeds the budget
  useEffect(() => {
    const categoryBudget = data.categoryBudget?.[lastRouteName] || 0
    if (!toastShown && categoryBudget && totalAmount > categoryBudget) {
      showWarningToast()
    }
  }, [
    data.categoryBudget,
    lastRouteName,
    totalAmount,
    toastShown,
    showWarningToast,
  ])

  // Remaining budget calculation
  const remainingBudget =
    Number(data.budget) - totalAmount
  const isOverBudget = remainingBudget < 0
  const budgetColor = isOverBudget ? "text-red-500" : "text-blue-700"

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>{lastRouteName}</CardTitle>
        <CardDescription>
          <section className="ml-2 mt-4 grid w-full grid-cols-1 gap-2 pb-2 pr-2 sm:grid-cols-2 lg:grid-cols-3">
            
            <Card_budget
              title="Remaining"
              amount={remainingBudget}
              color={budgetColor}
              icon={Wallet}
            />
            
            <Card_budget
              title="Expense"
              amount={Number(totalAmount.toFixed(2))}
              color="text-emi"
              icon={Wallet}
            />
            
            <SetCategory_Budget
              category={lastRouteName}
              currentBudget={Number(data.budget)}
              expense={Number(totalAmount.toFixed(2))}
            />

          </section>
          All {lastRouteName} Transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            A list of your {lastRouteName} transactions.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryTransaction.map((transaction, index) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.description || "-"}</TableCell>
                <TableCell className="text-right">
                  {`₹${parseFloat(transaction.amount).toFixed(2)}`}
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
