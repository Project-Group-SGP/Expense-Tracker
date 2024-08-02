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
import { ChartBar_1 } from "./charts/ChartBar_1"
import { ChartBar_3 } from "./charts/ChartBar_3"
import { ChartBar_4 } from "./charts/ChartBar_4"
import { FinancialData_ } from "../page"

import { Chart_income_expense_2 } from "./charts/Chart_income_expense_2"
import { Chart_income_expense_1 } from "./charts/Chart_income_expense_1"

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
  
  const [selectedChart, setSelectedChart] = React.useState("Bar chart_1")

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

  const incomeData: ChartData1[] = monthNames.map((month)=>({
    month,
    spend: 0,
  }))



  // Income-Expense data
const incomeExpenseData: ChartDataIncomeExpense[] = monthNames.map((month) => ({
  month,
  income: 0,
  expense: 0,
}))


  // expense data
  if (data.expense && Array.isArray(data.expense)) {
    data.expense.forEach((expense: Expense) => {
      const date = new Date(expense.date)
      const monthIndex = date.getUTCMonth() // Get month index (0 for January, 1 for February, etc.)
      const amount = parseFloat(expense.amount)
      expenseData[monthIndex].spend += amount
    })
  }

  console.log("expense Data" , expenseData);
  

  // income data
  if(data.income && Array.isArray(data.income)) {
    data.income.forEach((income: Expense) => {
      const date = new Date(income.date)
      const monthIndex = date.getUTCMonth() // Get month index (0 for January, 1 for February, etc.)
      const amount = parseFloat(income.amount)
      incomeData[monthIndex].spend += amount
    })
  }

  console.log("income Data" , incomeData);

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
  
  console.log("Income-expense Data" , incomeExpenseData);
  

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
      case "Bar chart_1":
        return <ChartBar_1 chartData={expenseData} />
      case "Bar chart_2":
        return <ChartBar_3 chartData={expenseData} />
      case "Bar chart_3":
        return <ChartBar_4 chartData={chartData3} />
      case "income-expense 1":
        return <Chart_income_expense_1 chartData={incomeExpenseData} />
      case "income-expense 2":
        return <Chart_income_expense_2  chartData={incomeExpenseData}/>

      default:
        return <ChartBar_3 chartData={expenseData} />
    }
  }

  return (
    <>
      <div className="w-max-[400px] flex items-center justify-between p-4">
        <p className="font-semibold">Transactions</p>
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
              <DropdownMenuRadioItem value="Bar chart_1">
                Bar chart_1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Bar chart_2">
                Bar chart_2
              </DropdownMenuRadioItem>
              
              <DropdownMenuRadioItem value="Bar chart_3">
                Bar chart_3
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="income-expense 1">
                  income-expense 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="income-expense 2">
                  income-expense 2
              </DropdownMenuRadioItem>

            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4">{renderChart()}</div>
    </>
  )
}

