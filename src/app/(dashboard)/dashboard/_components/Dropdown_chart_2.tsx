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
import { ChartBar_2 } from "./ChartBar_2"
import ChartPie_1 from "./ChartPie_1"
import ChartPie_2 from "./ChartPie_2"
import ChartPie_3 from "./ChartPie_3"
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
  Other: "#0033cc", // color for --chart-1
  Bills: "#009999", // color for --chart-5
  Food: "#ff9933", // color for --chart-3
  Entertainment: "#6a0dad", // color for --chart-4
  Transportation: "#cc3333", // color for --chart-2
  EMI: "#4caf50", // color for --chart-6
  Healthcare: "#ffeb3b", // color for --chart-7
  Education: "#f44336", // color for --chart-8
  Investment: "#009688", // color for --chart-9
  Shopping: "#03a9f4", // color for --chart-10
  Fuel: "#e91e63", // color for --chart-11
  Groceries: "#888888", // additional color (unchanged)
}

// Define DropdownChartProps

export function Dropdown_chart_2({ data }: DropdownChartProps) {
  const [selectedChart, setSelectedChart] = React.useState("pie chart_2")

  console.log(data)

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

  console.log("category wise data")
  console.log(chartData2)

  // Render selected chart
  const renderChart = () => {
    switch (selectedChart) {
      case "pie chart_1":
        return <ChartPie_1 chartData={chartData2} />
      case "pie chart_2":
        return <ChartPie_2 chartData={chartData2} />
      case "pie chart_3":
        return <ChartPie_3 chartData={chartData2} />
      case "chart_4":
        return <ChartBar_2 chartData={chartData2} />
      default:
        return <ChartPie_1 chartData={chartData2} />
    }
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 w-max-[400px]">
        <p className="font-semibold">Expenses</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-29">
              {selectedChart}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={selectedChart}
              onValueChange={setSelectedChart}
            >
              <DropdownMenuRadioItem value="pie chart_1">
                pie chart_1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pie chart_2">
                pie chart_2
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pie chart_3">
                pie chart_3
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="chart_4">
                chart_4
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4">{renderChart()}</div>
    </>
  )
}
