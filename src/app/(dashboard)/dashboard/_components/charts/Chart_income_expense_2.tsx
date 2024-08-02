"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Chart_income_expense_Props } from "./Chart_income_expense_1"

const chartData = [
  { month: "January", income: 186, expense: 80 },
  { month: "February", income: 305, expense: 200 },
  { month: "March", income: 237, expense: 120 },
  { month: "April", income: 273, expense: 190 },
  { month: "May", income: 209, expense: 130 },
  { month: "June", income: 214, expense: 140 },
  { month: "July", income: 220, expense: 150 },
  { month: "August", income: 230, expense: 160 },
  { month: "September", income: 240, expense: 170 },
  { month: "October", income: 250, expense: 180 },
  { month: "November", income: 260, expense: 190 },
  { month: "December", income: 270, expense: 200 },
]

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(120, 100%, 30%)",  // Bright green color
  },
  expense: {
    label: "Expense",
    color: "hsl(0, 100%, 50%)",  // Bright red color
  },
} satisfies ChartConfig

export function Chart_income_expense_2 ({ chartData }: Chart_income_expense_Props) {
  return (
    <Card>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[500px]"
        >
          <RadarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <PolarGrid stroke="#555" />
            <PolarAngleAxis dataKey="month" tick={{ fill: "#999" }} />
            <Radar
              name="Income"
              dataKey="income"
              stroke={chartConfig.income.color}
              fill={chartConfig.income.color}
              fillOpacity={0.6}
            />
            <Radar
              name="Expense"
              dataKey="expense"
              stroke={chartConfig.expense.color}
              fill={chartConfig.expense.color}
              fillOpacity={0.6}
            />
            <ChartLegend />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}