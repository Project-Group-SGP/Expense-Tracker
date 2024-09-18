"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Category_Graph } from "./Category_Graph"
import Transaction from "./Transaction"
import { CalendarIcon, TrendingUpIcon, ListIcon } from "lucide-react"

interface Expense {
  id: string
  category: string
  amount: string
  date: string
  description: string
}

interface CategoryData {
  filteredByMonth: {
    [month: string]: Expense[]
  }
}

interface CategoryBudget {
  budget: number
  monthwiseTotal: {
    [month: string]: number
  }
}

interface MonthSelectionProps {
  data: CategoryData
  budget: CategoryBudget
}

export default function Component({ data, budget }: MonthSelectionProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [availableMonths, setAvailableMonths] = useState<string[]>([])

  useEffect(() => {
    const months = Object.keys(data.filteredByMonth)
    setAvailableMonths(months)
    if (months.length > 0) {
      setSelectedMonth(months[months.length - 1])
    }
  }, [data])

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
  }

  const selectedExpenses = data.filteredByMonth[selectedMonth] || []
  const selectedMonthTotal = budget.monthwiseTotal[selectedMonth] || 0

  return (
    <div className="container mx-auto mt-8 px-3 py-4">
      <Card className="mb-4 flex min-h-[200px] flex-col items-center justify-center border-none bg-gradient-to-r shadow-none dark:bg-black">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-blue-700">
            Monthly Expense Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex w-full flex-col items-center justify-center">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-8 w-8 text-blue-600/70" />
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[200px] border-blue-600/20 bg-blue-600/5 text-blue-600 hover:bg-blue-600/10 focus:ring-blue-600/30">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent className="border-blue-600/20 bg-background">
                {availableMonths.map((month) => (
                  <SelectItem
                    key={month}
                    value={month}
                    className="cursor-pointer hover:bg-blue-600/10 focus:bg-blue-600/20"
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <Card className="rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <CardTitle className="flex items-center text-lg font-semibold text-green-600 dark:text-green-300 sm:text-xl">
              <TrendingUpIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <Category_Graph
              data={{
                expenses: selectedExpenses,
              }}
            />
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <CardTitle className="flex items-center text-lg font-semibold text-blue-600 dark:text-blue-300 sm:text-xl">
              <ListIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <Transaction
              data={{
                expenses: selectedExpenses,
                categoryBudget: budget.monthwiseTotal,
                budget: budget.budget,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
