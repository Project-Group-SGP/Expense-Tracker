"use server"
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { ExpenseFormData } from "./_components/NewExpense"
import { IncomeFormData } from "./_components/Newincome"
import { revalidateTag } from "next/cache"

// add new income
export async function AddnewIncome(data: IncomeFormData) {
  const user = await currentUserServer()
  const { transactionDate, amount, description } = data
  if (!user) {
    throw new Error("Login Please")
  }
  const newIncome = await db.income.create({
    data: { userId: user?.id, amount, date: transactionDate, description },
  })
  revalidateTag("totalIncome")
  revalidateTag("getAllData")
  return newIncome ? "success" : "error"
}

// add new expense
export async function AddnewExpense(data: ExpenseFormData) {
  const user = await currentUserServer()
  const { transactionDate, amount, description, category } = data
  if (!user) {
    throw new Error("Login Please")
  }
  const newExpense = await db.expense.create({
    data: {
      userId: user.id,
      amount,
      date: transactionDate,
      description,
      category,
    },
  })

  revalidateTag("totalExpense")
  revalidateTag("getAllData")
  
  return newExpense ? "success" : "error"
}
