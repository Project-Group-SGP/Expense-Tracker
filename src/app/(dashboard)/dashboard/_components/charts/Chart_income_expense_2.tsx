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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Chart_income_expense_Props } from "./Chart_income_expense_1"

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(143, 85%, 60%)",  // Brighter, more vibrant green
  },
  expense: {
    label: "Expense",
    color: "hsl(354, 85%, 60%)",  // Brighter, more vibrant red
  },
} satisfies ChartConfig

export function Chart_income_expense_2({ chartData }: Chart_income_expense_Props) {
  return (
    <Card className="w-full max-w-3xl mx-auto dark:bg-black shadow-none border-none">
      <CardHeader className="hidden sm:block sm:min-w-[400px]:hidden">
        <CardTitle className="text-2xl font-bold text-center">Income vs. Expense Radar</CardTitle>
        <CardDescription className="text-center text-gray-500">Monthly comparison of income and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto  aspect-square max-h-[500px]"
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
            <PolarGrid stroke="#777" strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="month" tick={{ fill: "#bbb", fontSize: 12 }} />
            <Radar
              name="Income"
              dataKey="income"
              stroke={chartConfig.income.color}
              fill={chartConfig.income.color}
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Radar
              name="Expense"
              dataKey="expense"
              stroke={chartConfig.expense.color}
              fill={chartConfig.expense.color}
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <ChartLegend verticalAlign="bottom" align="center" />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}