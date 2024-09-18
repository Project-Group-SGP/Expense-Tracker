import { currentUserServer } from "@/lib/auth"
import { GetBudgetDb, GetCategoryDataDb } from "./actions"
import dynamic from "next/dynamic"

const BudgetSelection = dynamic(
  () => import("./_components/budget_Selection"),
  { ssr: false }
)
// Define interfaces for returned data
interface MonthlyData {
  month: string
  totalIncome: number
  totalExpense: number
  categoryExpenses: Record<string, number>
  categoryBudget: Record<string, number>
  remainingBudget: number
}

interface BudgetData {
  monthlyData: MonthlyData[]
}

interface Budget {
  budget: number
}

// Ensure all categories are present with default values if missing
const ensureCategories = (data: BudgetData): BudgetData => {
  const allCategories = [
    "Other",
    "Bills",
    "Food",
    "Entertainment",
    "Transportation",
    "EMI",
    "Healthcare",
    "Education",
    "Investment",
    "Shopping",
    "Fuel",
    "Groceries",
  ]

  data.monthlyData.forEach((monthData) => {
    allCategories.forEach((category) => {
      if (!monthData.categoryExpenses.hasOwnProperty(category)) {
        monthData.categoryExpenses[category] = 0 // Default to zero if missing
      }
    })
  })

  return data
}

const Page = async () => {
  const user = await currentUserServer()

  if (!user) {
    Response.redirect("/auth/sigin")
  }

  const [data, budget] = await Promise.all([GetCategoryDataDb(), GetBudgetDb()])
  const data1 = ensureCategories(data) // Normalize the data

  if (!data || !budget) {
    // throw new Error("Data or budget not found")
    return (
      <div>
        <h1>No data found</h1>
      </div>
    )
  }

  return (
    <div className="mb-10 mr-10 mt-20">
      <BudgetSelection initialData={data1} budget={Number(budget.budget)} />
    </div>
  )
}

export default Page
