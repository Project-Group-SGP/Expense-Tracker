"use server"
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { CategoryTypes, Prisma } from "@prisma/client"

export async function getCategoryData(category: string) {
  try {
    // Get the current user from the session
    const user = await currentUserServer()

    if (!user || !user.id) {
      throw new Error("User Not Found")
    }

    // Fetch the expenses for the category from the database
    const expenses = await db.expense.findMany({
      where: {
        userId: user.id,
        category: category as CategoryTypes,
      },
      select: {
        id: true,
        category: true,
        amount: true,
        date: true,
        description: true,
      },
      orderBy: {
        date: "asc", // Orders the data by date
      },
    })

    // Function to group expenses by month
    const groupByMonth = (expenses) => {
      return expenses.reduce((acc, expense) => {
        const date = new Date(expense.date)
        const month = monthNames[date.getMonth()] // Get month name

        if (!acc[month]) {
          acc[month] = []
        }
        acc[month].push(expense)

        return acc
      }, {})
    }

    const filteredByMonth = groupByMonth(expenses)

    return { filteredByMonth } // Return the grouped expenses
  } catch (error) {
    console.error("Error fetching category data:", error)
    return null // Return null or handle the error appropriately
  }
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export async function getCategoryBudget(category: string) {
  try {
    // Fetch the current user from the server-side session
    const user = await currentUserServer()

    if (!user || !user.id) {
      throw new Error("User Not Found")
    }

    // Fetch budget and expenses from the database in parallel
    const [budget, expenses] = await Promise.all([
      db.category.findFirst({
        where: {
          userId: user.id,
          category: category as CategoryTypes,
        },
        select: {
          budget: true,
        },
      }),
      db.expense.findMany({
        where: {
          userId: user.id,
          category: category as CategoryTypes,
        },
      }),
    ])

    // If no budget is found, default to 0
    const finalBudget =
      budget?.budget instanceof Prisma.Decimal
        ? parseFloat(budget.budget.toString())
        : 0 // Default budget to 0 if not found

    // Group and sum expenses by month, defaulting to empty object if no expenses
    const monthwiseTotal = expenses.reduce(
      (acc, expense) => {
        const date = new Date(expense.date)
        const month = monthNames[date.getMonth()] // Get month name
        const amount = Number(expense.amount) // Convert amount to number

        if (!acc[month]) {
          acc[month] = 0
        }
        acc[month] += amount

        return acc
      },
      {} as Record<string, number>
    ) // Default to an empty object if no expenses

    console.log("Getting budget and monthwise category data")

    console.log("monthwiseTotal", monthwiseTotal)
    console.log("finalBudget", finalBudget)

    return { budget: finalBudget, monthwiseTotal }
  } catch (error) {
    console.error("Error fetching category budget data:", error)
    // Default to budget: 0 and empty monthwiseTotal object
    return { budget: 0, monthwiseTotal: {} }
  }
}

// Set or Update Category Budget
export async function SetCategoryBudgetDb(
  category: string,
  budget: number
): Promise<string> {
  try {
    // Get the current user from the session
    const user = await currentUserServer()

    if (!user || !user.id) {
      throw new Error("User Not Found")
    }

    console.log(
      "Setting budget for category ",
      category,
      " to ",
      budget,
      " for user ",
      user.id
    )

    const categoryType = category as CategoryTypes
    console.log(
      `Setting budget for category ${categoryType} to ${budget} for user ${user.id}`
    )

    const Budget = budget as number

    // Try to find the existing category
    const existingCategory = await db.category.findFirst({
      where: {
        userId: user.id,
        category: categoryType,
      },
    })

    let result
    if (existingCategory) {
      // Update existing category
      result = await db.category.update({
        where: {
          id: existingCategory.id,
        },
        data: {
          budget: Budget,
        },
      })
    } else {
      // Create new category
      result = await db.category.create({
        data: {
          userId: user.id,
          category: categoryType,
          budget: Budget,
        },
      })
    }

    if (result) {
      console.log(
        `Category ${category} budget set to ${budget} for user ${user.id}`
      )
      return "success"
    } else {
      console.error(`Failed to set budget for category ${category}`)
      return "error"
    }
  } catch (error) {
    console.error("Error updating budget:", error)
    return "error"
  }
}
