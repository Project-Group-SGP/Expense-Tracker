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
    
  )
}