"use server"
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { CategoryTypes, Prisma } from "@prisma/client"

type CategoryBudget = {
  [key in CategoryTypes]?: number
}

type MonthlyData = {
  month: string
  totalIncome: number
  totalExpense: number
  categoryExpenses: CategoryBudget
  categoryBudget: CategoryBudget
  remainingBudget: number
}

// Set budget USER
export async function SetBudgetDb(budget: number) {
  // Check login status
  const user = await currentUserServer()
  if (!user) {
    throw new Error("Please log in.")
  }

  try {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        budget: new Prisma.Decimal(budget),
      },
    })

    return "success"
  } catch (error) {
    console.error("Error in SetBudget:", error)
    throw new Error("Error setting budget.")
  }
}

// Get User Budget
export async function GetBudgetDb() {
  // Check login status
  const user = await currentUserServer()
  if (!user) {
    throw new Error("Please log in.")
  }

  try {
    const budget = await db.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        budget: true,
      },
    })

    if (!budget) {
      throw new Error("Budget not found.")
    }

    // console.log("budget", budget.budget)
    return budget
  } catch (error) {
    console.error("Error in GetBudget:", error)
    throw new Error("Error getting budget.")
  }
}

// Get Category Expense Data
export async function GetCategoryDataDb() {
  try {
    const user = await currentUserServer()
    if (!user?.id) {
      throw new Error("User not authenticated")
    }
    const userId = user.id
    const currentYear = new Date().getFullYear()

    // Fetch category data and user budget
    const [categoryData, budget] = await Promise.all([
      db.category.findMany({
        where: { userId },
        select: { category: true, budget: true },
      }),
      db.user.findUnique({
        where: { id: userId },
        select: { budget: true },
      }),
    ])

    // Prepare monthly data for the current year
    const monthlyDataPromises = Array.from({ length: 12 }, async (_, month) => {
      const startDate = new Date(currentYear, month, 1)
      const endDate = new Date(currentYear, month + 1, 0)

      const [income, expenses, totalExpense] = await Promise.all([
        db.income.aggregate({
          _sum: { amount: true },
          where: {
            userId,
            date: { gte: startDate, lte: endDate },
          },
        }),
        db.expense.findMany({
          where: {
            userId,
            date: { gte: startDate, lte: endDate },
          },
          select: { category: true, amount: true },
        }),
        db.expense.aggregate({
          _sum: { amount: true },
          where: {
            userId,
            date: { gte: startDate, lte: endDate },
          },
        }),
      ])

      const totalIncome = income._sum.amount?.toNumber() || 0
      const totalExpenseAmount = totalExpense._sum.amount?.toNumber() || 0

      // Prepare category budgets and expenses
      const categoryBudget: CategoryBudget = {}
      const categoryExpenses: CategoryBudget = {}

      categoryData.forEach((category) => {
        categoryBudget[category.category] = category.budget?.toNumber() || 0
      })

      expenses.forEach((expense) => {
        const expenseAmount = expense.amount ? expense.amount.toNumber() : 0
        categoryExpenses[expense.category] =
          (categoryExpenses[expense.category] || 0) + expenseAmount
      })

      const remainingBudget =
        (budget?.budget ? budget.budget.toNumber() : 0) - totalExpenseAmount

      return {
        month: startDate.toLocaleString("default", { month: "long" }),
        totalIncome,
        totalExpense: totalExpenseAmount,
        categoryExpenses,
        categoryBudget,
        remainingBudget,
      }
    })

    const monthlyData = await Promise.all(monthlyDataPromises)

    return {
      monthlyData,
      budget: budget?.budget?.toNumber() || 0,
    }
  } catch (error) {
    console.error("Error in GetCategoryDataDb:", error)
    throw new Error("Error getting category data.")
  }
}
