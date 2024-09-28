"use server"

import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { Transaction } from "./page"

function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day) // month is 0-indexed in JavaScript Date
}

export async function SaveTransactions(data: Transaction[]) {
  const user = await currentUserServer()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const incomeData = data
    .filter((t) => t.Category === "Income")
    .map((t) => ({
      userId: user.id,
      amount: t.Amount,
      date: parseDate(t.Date),
      description: t.Description,
    }))

  const expenseData = data
    .filter((t) => t.Category !== "Income")
    .map((t) => ({
      userId: user.id,
      category: t.Category as any,
      amount: Math.abs(t.Amount),
      date: parseDate(t.Date),
      description: t.Description,
    }))

  // console.log(incomeData, expenseData)

  try {
    await db.$transaction([
      db.income.createMany({
        data: incomeData,
      }),
      db.expense.createMany({
        data: expenseData,
      }),
    ])
    // revalidateTag("totalIncome")
    // revalidateTag("totalExpense")
    // revalidateTag("getAllData")

    return { success: true, message: "Transactions saved successfully" }
  } catch (error) {
    console.error("Error saving transactions:", error)
    return { success: false, message: "Failed to save transactions" }
  }
}
