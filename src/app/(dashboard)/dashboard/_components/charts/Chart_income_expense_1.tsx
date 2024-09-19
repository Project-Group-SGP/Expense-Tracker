"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartDataIncomeExpense } from "../Dropdown_chart_1"


const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(120, 100%, 50%)",  // Green color
  },
  expense: {
    label: "Expense",
    color: "hsl(0, 100%, 50%)",  // Red color
  },
} satisfies ChartConfig;

export type Chart_income_expense_Props = {
  chartData: ChartDataIncomeExpense[]
}

export function Chart_income_expense_1({ chartData }: Chart_income_expense_Props) {
  return (
    <Card className="border-none shadow-none bg-none dark:bg-black">
      <CardHeader className="hidden sm:block sm:min-w-[400px]:hidden">
        <CardTitle>Income vs Expense</CardTitle>
        <CardDescription>Monthly comparison of income and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke={chartConfig.income.color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke={chartConfig.expense.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Income vs Expense Trend
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}