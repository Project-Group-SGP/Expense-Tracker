"use client"

import { useRouter } from "next/navigation"
import Card_Category from "./Card_Category"
import {
  Bus,
  ChartNoAxesCombined,
  ChefHat,
  ShieldQuestion,
  Clapperboard,
  Fuel,
  GraduationCap,
  HandCoins,
  Hospital,
  ReceiptText,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react"
import { CategoryTypes } from "@prisma/client"

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

  const handleCategoryClick = (path) => {
    router.push(path)
  }

  return (
    <section className="ml-6 mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categoryItems.map((category) => (
        <div
          key={category.title}
          onClick={() => handleCategoryClick(category.path)}
        >
          <Card_Category
            title={category.title}
            amount={props.categories[category.title] || 0}
            color={category.color}
            icon={category.icon}
          />
        </div>
      ))}
    </section>
  )
}

export default CategoryList
