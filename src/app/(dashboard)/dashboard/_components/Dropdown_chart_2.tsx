"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as React from "react"
import ChartPie_1 from "./charts/ChartPie_1"
import ChartPie_3 from "./charts/ChartPie_3"
import { ChartPie_4 } from "./charts/ChartPie_4"
import { DropdownChartProps } from "./Dropdown_chart_1"

// Define data types
export type ChartData2 = {
  category: string
  spend: number
  fill: string
}

type Expense = {
  id: string
  userId: string
  category: string
  amount: string
  date: string
  description: string
}

// Define colors for categories
const categoryColors: { [key: string]: string } = {
  Other: "#A9A9A9", // Dark Gray
  Bills: "#4169E1", // Royal Blue (slightly darker than Dodger Blue)
  Food: "#FF6347", // Tomato Red
  Entertainment: "#FFD700", // Gold
  Transportation: "#4682B4", // Steel Blue
  EMI: "#DC143C", // Crimson
  Healthcare: "#20B2AA", // Light Sea Green
  Education: "#9370DB", // Medium Purple
  Investment: "#228B22", // Forest Green
  Shopping: "#FF69B4", // Hot Pink (slightly softer than Deep Pink)
  Fuel: "#FFA500", // Orange
  Groceries: "#32CD32", // Lime Green
}

// Define DropdownChartProps

export function Dropdown_chart_2({ data }: DropdownChartProps) {
  const [selectedChart, setSelectedChart] = React.useState("Category Crustview")

  // console.log(data)

  // Check if `data` and `data.expense` are valid
  if (!data || !Array.isArray(data.expense)) {
    return <div>No expense data available</div>
  }

  // Calculate category-wise spend
  const categorySpend: { [key: string]: number } = {}

  data.expense.forEach((expense: Expense) => {
    let amount: number

    if (typeof expense.amount === "string") {
      amount = parseFloat(expense.amount)
    } else if (typeof expense.amount === "number") {
      amount = expense.amount
    } else {
      console.error("Unexpected amount type:", expense.amount)
      return // Skip this iteration
    }

    if (!isNaN(amount)) {
      if (!categorySpend[expense.category]) {
        categorySpend[expense.category] = 0
      }
      categorySpend[expense.category] += amount
    }
  })

  const chartData2: ChartData2[] = Object.keys(categorySpend).map(
    (category) => ({
      category,
      spend: categorySpend[category],
      fill: categoryColors[category] || "#888888", // Default color if category is not defined
    })
  )

  // console.log("category wise data")
  // console.log(chartData2)

  // Render selected chart
  const renderChart = () => {
    switch (selectedChart) {
      case "Category Crustview":
        return <ChartPie_1 chartData={chartData2} />
      // case "pie chart_2":
      //   return <ChartPie_2 chartData={chartData2} />
      case "Spending Circle":
        return <ChartPie_3 chartData={chartData2} />
      case "Spend Spectrum":
        return <ChartPie_4 chartData={chartData2} />
      default:
        return <ChartPie_1 chartData={chartData2} />
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[400px]">
        <div className="flex flex-col items-center justify-between space-y-2 p-4 sm:flex-row sm:space-y-0">
          <p className="text-lg font-semibold">Expenses</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                {selectedChart}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={selectedChart}
                onValueChange={setSelectedChart}
              >
                <DropdownMenuRadioItem value="Category Crustview">
                  Category Crustview
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Spending Circle">
                  Spending Circle
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Spend Spectrum">
                  Spend Spectrum
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-4">{renderChart()}</div>
      </div>
    </>
  )
}
