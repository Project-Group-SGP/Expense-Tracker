
import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HandCoins, Wallet } from "lucide-react"
import Card_unclick from "./Card_unclick"
import { SetBudget } from "./Setbudget"
import { toast } from "sonner"

type BudgetUsageGraphProps = {
  totalIncome: number
  budget: number
  perDayBudget: number
  totalExpense: number
}

export function OverallGraph(props: BudgetUsageGraphProps) {
  const month = [
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

  const currentMonth = new Date().getMonth()

  const remainingBudget = props.budget - props.totalExpense
  const isOverBudget = remainingBudget < 0
  const budgetColor = isOverBudget ? "text-emi" : "text-blue-700"

  // Calculate the percentage of the budget used
  const percentUsed = Math.min((props.totalExpense / props.budget) * 100, 100)

 
  // SVG parameters
  const size = 180
  const strokeWidth = 15
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const fillPercentage = (percentUsed / 100) * circumference

  const circleColor = "#4A4A4A"
  const filledColor = isOverBudget ? "#dc2626" : "#2EB88A"

  return (
    <Card className="ml-6 mr-6 flex w-full flex-col rounded-lg border-none shadow-lg">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg font-semibold">Budget Usage</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {month[currentMonth]}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="flex items-center justify-center">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={circleColor}
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
              fill={"white"}
            >
              {props.totalExpense} <br />
            </text>
          </svg>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-around gap-2">
          <div className="max-w-[300px] flex-1">
            <Card_unclick
              title="Income"
              amount={Number(props.totalIncome)}
              color="text-green-600"
              icon={HandCoins}
            />
          </div>
          <div className="max-w-[300px] flex-1">
            <SetBudget currentBudget={Number(props.budget)} expense={props.totalExpense} />
          </div>
          <div className="max-w-[300px] flex-1">
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
