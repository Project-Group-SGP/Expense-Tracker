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

    console.log("budget", budget.budget)
    return budget
  } catch (error) {
    console.error("Error in GetBudget:", error)
    throw new Error("Error getting budget.")
  }
}

// Get Category Expense Data
export async function GetCategoryDataDb(){
  try {
    const user = await currentUserServer()
    if (!user?.id) {
      console.error("User not authenticated")
      throw new Error("User not authenticated")
    }
    const userId = user.id
    const currentYear = new Date().getFullYear()

    // Fetch category data and user budget
    let categoryData, budget
    try {
      [categoryData, budget] = await Promise.all([
        db.category.findMany({
          where: { userId },
          select: { category: true, budget: true },
        }),
        db.user.findUnique({
          where: { id: userId },
          select: { budget: true },
        }),
      ])
    } catch (error) {
      console.error("Error fetching category data or user budget:", error)
      throw new Error("Database query failed for category data or user budget")
    }

    if (!categoryData || categoryData.length === 0) {
      console.error("No category data found for user")
      throw new Error("No category data found")
    }

    if (!budget) {
      console.error("No budget found for user")
      throw new Error("No budget found")
    }

    // Prepare monthly data for the current year
    const monthlyDataPromises = Array.from({ length: 12 }, async (_, month) => {
      const startDate = new Date(currentYear, month, 1)
      const endDate = new Date(currentYear, month + 1, 0)

      let income, expenses, totalExpense
      try {
        [income, expenses, totalExpense] = await Promise.all([
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
      } catch (error) {
        console.error(`Error fetching data for month ${month + 1}:`, error)
        throw new Error(`Failed to fetch data for month ${month + 1}`)
      }

      const totalIncome = income._sum.amount?.toNumber() || 0
      const totalExpenseAmount = totalExpense._sum.amount?.toNumber() || 0

      // Prepare category budgets and expenses
      const categoryBudget: CategoryBudget = {}
      const categoryExpenses: CategoryBudget = {}

      categoryData.forEach((category) => {
        if (category.category && category.budget) {
          categoryBudget[category.category] = category.budget.toNumber()
        } else {
          console.warn(`Invalid category data: ${JSON.stringify(category)}`)
        }
      })

      expenses.forEach((expense) => {
        if (expense.category && expense.amount) {
          const expenseAmount = expense.amount.toNumber()
          categoryExpenses[expense.category] = (categoryExpenses[expense.category] || 0) + expenseAmount
        } else {
          console.warn(`Invalid expense data: ${JSON.stringify(expense)}`)
        }
      })

      const remainingBudget = (budget.budget?.toNumber() || 0) - totalExpenseAmount

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
      budget: budget.budget?.toNumber() || 0,
    }
  } catch (error) {
    console.error("Error in GetCategoryDataDb:", error)
    throw new Error(`Error getting category data: ${error}`)
  }
}