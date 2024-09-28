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
import { FinancialData_ } from "../page"
import { ChartBar_1 } from "./charts/ChartBar_1"
import { ChartBar_3 } from "./charts/ChartBar_3"
import { ChartBar_4 } from "./charts/ChartBar_4"

import { Chart_income_expense_1 } from "./charts/Chart_income_expense_1"
import { Chart_income_expense_2 } from "./charts/Chart_income_expense_2"

export type Expense = {
  id: string
  userId: string
  category: string
  amount: string
  date: string
  description: string
}

// 1
export type ChartData1 = {
  month: string
  spend: number
}

// 3
export type ChartData3 = {
  date: string
  spend: number
}

export type ChartDataIncomeExpense = {
  month: string
  income: number
  expense: number
}

export type DropdownChartProps = {
  data: FinancialData_
}

export function Dropdown_chart_1({ data }: DropdownChartProps) {
  const [selectedChart, setSelectedChart] = React.useState(
    "Monthly Money Meters"
  )

  // 1. monthwise data
  const monthNames: string[] = [
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

  const expenseData: ChartData1[] = monthNames.map((month) => ({
    month,
    spend: 0,
  }))

  const incomeData: ChartData1[] = monthNames.map((month) => ({
    month,
    spend: 0,
  }))

  // Income-Expense data
  const incomeExpenseData: ChartDataIncomeExpense[] = monthNames.map(
    (month) => ({
      month,
      income: 0,
      expense: 0,
    })
  )

  // expense data
  if (data.expense && Array.isArray(data.expense)) {
    data.expense.forEach((expense: Expense) => {
      const date = new Date(expense.date)
      const monthIndex = date.getUTCMonth() // Get month index (0 for January, 1 for February, etc.)
      const amount = parseFloat(expense.amount)
      expenseData[monthIndex].spend += amount
    })
  }

  // console.log("expense Data", expenseData)

  // income data
  if (data.income && Array.isArray(data.income)) {
    data.income.forEach((income: Expense) => {
      const date = new Date(income.date)
      const monthIndex = date.getUTCMonth() // Get month index (0 for January, 1 for February, etc.)
      const amount = parseFloat(income.amount)
      incomeData[monthIndex].spend += amount
    })
  }

  // console.log("income Data", incomeData)

  // income - expanse data
  if (data.expense && Array.isArray(data.expense)) {
    data.expense.forEach((expense: Expense) => {
      const date = new Date(expense.date)
      const monthIndex = date.getUTCMonth()
      const amount = parseFloat(expense.amount)
      incomeExpenseData[monthIndex].expense += amount
    })
  }

  if (data.income && Array.isArray(data.income)) {
    data.income.forEach((income: Expense) => {
      const date = new Date(income.date)
      const monthIndex = date.getUTCMonth()
      const amount = parseFloat(income.amount)
      incomeExpenseData[monthIndex].income += amount
    })
  }

  // console.log("Income-expense Data", incomeExpenseData)

  // console.log("month wise data");
  // console.log(chartData1)

  // 3 Date wise
  const chartData3: ChartData3[] = []

  if (data.expense && Array.isArray(data.expense)) {
    data.expense.forEach((expense: Expense) => {
      const date = new Date(expense.date).toISOString().split("T")[0] // Get date in YYYY-MM-DD format
      const amount = parseFloat(expense.amount)

      // Check if the date already exists in chartData
      const existingData = chartData3.find((data) => data.date === date)

      if (existingData) {
        existingData.spend += amount
      } else {
        chartData3.push({ date, spend: amount })
      }
    })
  }

  // console.log("Date wise data")
  // console.log(chartData3)

  const renderChart = () => {
    switch (selectedChart) {
      case "Monthly Money Meters":
        return <ChartBar_1 chartData={expenseData} />
      // case "Bar chart_2":
      //   return <ChartBar_3 chartData={expenseData} />
      case "Daily Money Meters":
        return <ChartBar_4 chartData={chartData3} />
      case "Financial Flow":
        return <Chart_income_expense_1 chartData={incomeExpenseData} />
      case "Financial Footprint":
        return <Chart_income_expense_2 chartData={incomeExpenseData} />

      default:
        return <ChartBar_3 chartData={expenseData} />
    }
  }

  return (
    <div className="mx-auto w-full max-w-[400px]">
      <div className="flex flex-col items-center justify-between space-y-2 p-4 sm:flex-row sm:space-y-0">
        <p className="text-lg font-semibold">Transactions</p>
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
              <DropdownMenuRadioItem value="Monthly Money Meters">
                Monthly Money Meters
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Daily Money Meters">
                Daily Money Meters
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Financial Flow">
                Financial Flow
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Financial Footprint">
                Financial Footprint
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4">{renderChart()}</div>
    </div>
  )
}
