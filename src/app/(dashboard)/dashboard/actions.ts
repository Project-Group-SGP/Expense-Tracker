"use server"
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { ExpenseFormData } from "./_components/NewExpense"
import { IncomeFormData } from "./_components/Newincome"
import { revalidateTag } from "next/cache"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { get } from "http"

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

// generate financial advice
export async function generateFinancialAdvice() {
  try {
    // Check login status
    const user = await currentUserServer()
    if (!user) {
      throw new Error("Please log in.")
    }

    //get the budget
    const budget = await db.user.findUnique({
      where: { id: user.id },
      select: { budget: true },
    })
    if (!budget) {
      throw new Error("Budget not found.")
    }

    const now = new Date()
    const startmonthdate = new Date(now.getFullYear(), now.getMonth(), 1)
    console.log("startmonthdate", startmonthdate)
    const todayDate = new Date()
    console.log("todayDate", todayDate)

    //get this month total income
    const totalIncome = await db.income.aggregate({
      _sum: { amount: true },
      where: { userId: user.id, date: { gte: startmonthdate, lte: todayDate } },
    })
    if (!totalIncome) {
      throw new Error("Total income not found.")
    }

    // get this month total expense
    const totalExpense = await db.expense.aggregate({
      _sum: { amount: true },
      where: { userId: user.id, date: { gte: startmonthdate, lte: todayDate } },
    })

    if (!totalExpense) {
      throw new Error("Total expense not found.")
    }

    //get category wise expense
    const categoryData = await db.category.findMany({
      where: { userId: user.id },
      select: { category: true, budget: true },
    })
    if (!categoryData) {
      throw new Error("Category data not found.")
    }

    // get category wise expense
    const categoryExpense = await Promise.all(
      categoryData.map(async (category) => {
        const expense = await db.expense.aggregate({
          _sum: { amount: true },
          where: {
            userId: user.id,
            category: category.category,
            date: { gte: startmonthdate, lte: todayDate },
          },
        })
        if (!expense) {
          throw new Error("Category expense not found.")
        }
        return {
          category: category.category,
          budget: category.budget,
          expense: expense._sum.amount,
        }
      })
    )

    console.log(categoryExpense)
    console.log(totalIncome._sum.amount)
    console.log(totalExpense._sum.amount)
    console.log(budget.budget)

    // Initialize the Google Generative AI client
    if (!process.env.NEXT_PUBLIC_GEMINI_AI) {
      throw new Error("Missing NEXT_PUBLIC_GEMINI_AI environment variable")
    }
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_AI)
    const prompt = `Generate unique financial advice for a user with a budget of ₹${budget.budget} " 
      expenses of ₹ ${totalExpense._sum.amount} , and income of ₹+ ${totalIncome._sum.amount} categroy wise expense data are ${categoryExpense}.  
      Provide personalized tips for managing deficits, focusing on cutting expenses, boosting income, and practicing mindful spending, using engaging language and emojis for clarity. and make it in two-three line.`

    // For this example, we'll use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return { result: text }
  } catch (error: any) {
    console.error("Error generating content:", error)
    return { error: "Failed to generate content", details: error.message }
  }
}
