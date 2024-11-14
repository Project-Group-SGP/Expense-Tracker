"use client"

import { Bus, BarChartIcon as ChartNoAxesCombined, ChefHat, Clapperboard, Fuel, GraduationCap, HandCoins, Hospital, ReceiptText, ShieldQuestion, ShoppingCart, UtensilsCrossed } from 'lucide-react'
import { useRouter } from "next/navigation"
import Card_Category from "./Card_Category"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

type CategoryListType = {
  categories: {
    [key: string]: number
  }
}

const CategoryList = (props: CategoryListType) => {
  const router = useRouter()

  const categoryItems = [
    {
      title: "Food",
      color: "text-food",
      icon: UtensilsCrossed,
      path: "/budget/food",
    },
    {
      title: "Bills",
      color: "text-bills",
      icon: ReceiptText,
      path: "/budget/bills",
    },
    {
      title: "Entertainment",
      color: "text-entertainment",
      icon: Clapperboard,
      path: "/budget/entertainment",
    },
    {
      title: "Transportation",
      color: "text-transportation",
      icon: Bus,
      path: "/budget/transportation",
    },
    { title: "EMI", color: "text-emi", icon: HandCoins, path: "/budget/emi" },
    {
      title: "Healthcare",
      color: "text-healthcare",
      icon: Hospital,
      path: "/budget/healthcare",
    },
    {
      title: "Education",
      color: "text-education",
      icon: GraduationCap,
      path: "/budget/education",
    },
    {
      title: "Investment",
      color: "text-investment",
      icon: ChartNoAxesCombined,
      path: "/budget/investment",
    },
    {
      title: "Shopping",
      color: "text-shopping",
      icon: ShoppingCart,
      path: "/budget/shopping",
    },
    { title: "Fuel", color: "text-fuel", icon: Fuel, path: "/budget/fuel" },
    {
      title: "Groceries",
      color: "text-groceries",
      icon: ChefHat,
      path: "/budget/groceries",
    },
    {
      title: "Other",
      color: "text-other",
      icon: ShieldQuestion,
      path: "/budget/other",
    },
  ]

  const handleCategoryClick = (path: string) => {
    router.push(path)
  }

  const filteredCategories = categoryItems.filter(
    (category) => props.categories[category.title] !== 0
  )

  const allCategoriesZero = filteredCategories.length === 0

  return (
    <section className="ml-6 mt-4 w-full">
      {allCategoriesZero ? (
        <Alert variant="default" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Categories</AlertTitle>
          <AlertDescription>
            There are no categories with non-zero amounts. Start adding expenses to see categories here!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <div
              key={category.title}
              onClick={() => handleCategoryClick(category.path)}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <Card_Category
                title={category.title}
                amount={props.categories[category.title] || 0}
                color={category.color}
                icon={category.icon}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default CategoryList