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
      }),
      db.expense.findMany({
        where: {
          userId: user.id,
          category: category as CategoryTypes,
        },
      }),
    ])

    if (!budget && expenses.length === 0) {
      throw new Error("No data found for the provided category")
    }

    // Convert budget to a number, defaulting to 0 if null or undefined
    const finalBudget =
      budget?.budget instanceof Prisma.Decimal
        ? parseFloat(budget.budget.toString())
        : (budget?.budget ?? 0)

    // Group and sum expenses by month
    const monthwiseTotal = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date)
      const month = monthNames[date.getMonth()] // Get month name
      const amount = Number(expense.amount) // Convert amount to number

      if (!acc[month]) {
        acc[month] = 0
      }
      acc[month] += amount

      return acc
    }, {})

    console.log("getting budget and monthwise category data")

    // console.log("finalBudget : " + finalBudget)
    // console.log("monthwiseTotal : " + JSON.stringify(monthwiseTotal))

    return { budget: finalBudget, monthwiseTotal } // Return the data
  } catch (error) {
    console.error("Error fetching category budget data:", error)
    return null // Return null or handle the error appropriately
  }
}

function toCategoryType(category: string): CategoryTypes {
  if (Object.values(CategoryTypes).includes(category as CategoryTypes)) {
    return category as CategoryTypes
  }
  return CategoryTypes.Other
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

    const categoryType = toCategoryType(category)

    // Try to find the existing category
    const existingCategory = await db.category.findFirst({
      where: {
        userId: user.id,
        category: categoryType,
      },
    })
    
    let result;
    if (existingCategory) {
      // Update existing category
      result = await db.category.update({
        where: {
          id: existingCategory.id,
        },
        data: {
          budget: budget,
        },
      })
    } else {
      // Create new category
      result = await db.category.create({
        data: {
          userId: user.id,
          category: categoryType,
          budget: budget,
        },
      })
    }

    if (result) {
      console.log(`Category ${category} budget set to ${budget} for user ${user.id}`)
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