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
  budget: number ;
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
      <Card className="mb-4 bg-gradient-to-r dark:bg-black shadow-none border-none flex flex-col items-center justify-center min-h-[200px]">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-blue-700">
          Monthly Expense Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center w-full">
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
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
          <CardHeader className="rounded-lg bg-gradient-to-r">
            <CardTitle className="flex items-center text-xl font-semibold text-green-500">
              <TrendingUpIcon className="mr-2 h-6 w-6 rounded-lg" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Category_Graph
              data={{
                expenses: selectedExpenses,
              }}
            />
          </CardContent>
        </Card>
        <Card className="rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
          <CardHeader className="rounded-lg bg-gradient-to-r">
            <CardTitle className="flex items-center text-xl font-semibold text-blue-600">
              <ListIcon className="mr-2 h-6 w-6" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Transaction
              data={{
                expenses: selectedExpenses,
                categoryBudget: budget.monthwiseTotal,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
