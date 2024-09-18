import { CategoryTypes } from "@prisma/client"
import Month_selection from "./_components/month_selection"
import { getCategoryBudget, getCategoryData } from "./action"

// Page component
const Page = async ({ params: { category } }) => {
  function toCategoryType(category: string): CategoryTypes {
    // Normalize the category string to upper case
    const normalizedCategory = category.trim().toLowerCase()

    // Create a map of normalized enum values for easy lookup
    const categoryMap: { [key: string]: CategoryTypes } = Object.values(
      CategoryTypes
    ).reduce(
      (map, key) => {
        map[key.toLowerCase()] = key as CategoryTypes
        return map
      },
      {} as { [key: string]: CategoryTypes }
    )

    // Return the matched enum value or default to CategoryTypes.Other
    return categoryMap[normalizedCategory] || CategoryTypes.Other
  }

  const CategoryEnum = toCategoryType(category)
  // console.log("lastRouteName : " + CategoryEnum);

  // Fetch data based on the last segment
  let [data, budget] = await Promise.all([
    getCategoryData(CategoryEnum),
    getCategoryBudget(CategoryEnum),
  ])

  // console.log("lastRouteName : " + CategoryEnum)

  // console.log(data)
  console.log("Inside [category]/page.tsx : " + budget.budget)

  console.log(budget.budget)

  if (!data || !budget) {
    throw new Error("No data found for the provided category")
  }

  return <Month_selection data={data} budget={budget} />
}

export default Page
