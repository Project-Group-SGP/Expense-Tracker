"use client"
import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HandCoins, Wallet } from "lucide-react"
import Card_unclick from "./Card_unclick"
import { SetBudget } from "./Setbudget"

type CategoryBudget = {
  [key: string]: number // Dynamic keys for categories
}

type MonthlyData = {
  month: string
  totalIncome: number
  totalExpense: number
  categoryExpenses: CategoryBudget
  categoryBudget: CategoryBudget
  remainingBudget: number
}

type OverallGraphProps = {
  monthlyData: MonthlyData[]
  selectedMonth: number
  budget: number
}

export function OverallGraph({
  monthlyData,
  selectedMonth,
  budget,
}: OverallGraphProps) {
  const months = [
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

  const [currentMonthData, setCurrentMonthData] = useState(
    monthlyData[selectedMonth]
  )

  useEffect(() => {
    setCurrentMonthData(monthlyData[selectedMonth])
  }, [selectedMonth, monthlyData])

  const remainingBudget = currentMonthData.remainingBudget
  const isOverBudget = remainingBudget < 0
  const budgetColor = isOverBudget ? "text-emi" : "text-blue-700"

  // Calculate the total budget
  const totalBudget = Object.values(currentMonthData.categoryBudget).reduce(
    (sum, value) => sum + value,
    0
  )

  // Calculate the percentage of the budget used
  const percentUsed = Math.min(
    (currentMonthData.totalExpense / budget) * 100,
    100
  )

  // SVG parameters
  const size = 180
  const strokeWidth = 15
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const fillPercentage = (percentUsed / 100) * circumference

  //  const currentTheme = theme.theme;
  // const circleColor = currentTheme === "dark" ? "#4A4A4A" : "#D1D5DB"
  const filledColor = isOverBudget ? "#dc2626" : "#2EB88A"

  return (
    <Card className="ml-6 mr-6 flex w-full flex-col rounded-lg border-none shadow">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg font-semibold">Budget Usage</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="flex items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              // stroke={circleColor}
              className="stroke-gray-300 dark:stroke-zinc-700"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={filledColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - fillPercentage}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="28"
              fontWeight="bold"
              fill="currentColor"
              className="text-gray-900 dark:text-white"
            >
              {currentMonthData.totalExpense.toLocaleString("en-IN")} <br />
            </text>
          </svg>
        </div>
      </CardContent>
      <CardFooter>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-card p-4 text-card-foreground">
            <Card_unclick
              title="Income"
              amount={Number(currentMonthData.totalIncome)}
              color="text-green-600"
              icon={HandCoins}
            />
          </div>
          <div className="rounded-lg bg-card p-4 text-card-foreground">
            <SetBudget
              currentBudget={budget}
              expense={currentMonthData.totalExpense}
            />
          </div>
          <div className="rounded-lg bg-card p-4 text-card-foreground sm:col-span-2 lg:col-span-1">
            <Card_unclick
              title="Remaining"
              amount={Number(remainingBudget)}
              color={budgetColor}
              icon={Wallet}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
