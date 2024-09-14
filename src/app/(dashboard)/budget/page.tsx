// This is a server component
import { fetchBudgetData } from "./actions"
import { OverallGraph } from "./_components/OverallGraph"
import CategoryList from "./_components/CategoryList"
import BudgetSelection from "./_components/budget_Selection"

// Ensure all categories are present with default values if missing
const ensureCategories = (data: any) => {
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

  data.monthlyData.forEach((monthData: any) => {
    allCategories.forEach((category) => {
      if (!monthData.categoryExpenses.hasOwnProperty(category)) {
        monthData.categoryExpenses[category] = 0 // Default to zero if missing
      }
    })
  })

  return data
}

const Page = async () => {
  let data = await fetchBudgetData()
  data = ensureCategories(data) // Normalize the data here

  // console.log("Inside main Page.tsx");
  // console.log(JSON.stringify(data, null, 2));

  return (
    <div className="mb-10 mr-10 mt-20">
      <BudgetSelection initialData={data} />
    </div>
  )
}

export default Page
