"use server"

import { db } from "@/lib/db"
import { currentUserServer } from "@/lib/auth"
import { IncomeFormData } from "./_components/Newincome"
import { ExpenseFormData } from "./_components/NewExpense"

// get current user
async function getCurrentUser() {
  const user = await currentUserServer()
  if (!user) throw new Error("User not found")
  return user
}

// add new income
export async function AddnewIncome(data: IncomeFormData) {
  const user = await getCurrentUser()
  const { transactionDate, amount, description } = data

  const newIncome = await db.income.create({
    data: { userId: user.id, amount, date: transactionDate, description },
  })

  return newIncome ? "success" : "error"
}

// add new expense
export async function AddnewExpense(data: ExpenseFormData) {
  const user = await getCurrentUser()
  const { transactionDate, amount, description, category } = data

  const newExpense = await db.expense.create({
    data: {
      userId: user.id,
      amount,
      date: transactionDate,
      description,
      category,
    },
  })

  return newExpense ? "success" : "error"
}

// get total income
export async function getTotalIncome() {
  const user = await getCurrentUser()
  const amount = await db.income.aggregate({
    _sum: { amount: true },
    where: { userId: user.id },
  })

  return amount._sum.amount?.toNumber() ?? 0
}

// get total expense
export async function getTotalExpense() {
  const user = await getCurrentUser()
  const amount = await db.expense.aggregate({
    _sum: { amount: true },
    where: { userId: user.id },
  })

  return amount._sum.amount?.toNumber() ?? 0
}

// get monthly spend
// export async function getMonthlySpendData() {
//   const user = await currentUserServer()
//   if (!user) {
//     throw new Error("User not found")
//   }

//   const currentYear = new Date().getFullYear()

//   const monthlyData = await db.expense.groupBy({
//     by: ["month"],
//     _sum: {
//       amount: true,
//     },
//     where: {
//       userId: user.id,
//       date: {
//         gte: new Date(currentYear, 0, 1),
//         lt: new Date(currentYear + 1, 0, 1),
//       },
//     },
//     orderBy: {
//       month: "asc",
//     },
//   })

//   const formattedData = monthlyData.map((item) => ({
//     month: new Date(currentYear, item.month - 1, 1).toLocaleString("default", {
//       month: "long",
//     }),
//     spend: item._sum.amount?.toNumber() ?? 0,
//   }))

//   return formattedData
// }
