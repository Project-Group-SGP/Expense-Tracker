"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

import { HandCoins, CircleGauge, Wallet } from "lucide-react"
import Card_click from "./Card_unclick"
import Card_unclick from "./Card_unclick"
import { SetBudget } from "./Setbudget"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type OverallGraphProps = {
  totalIncome: number
  budget: number
  perDayBudget: number
  totalExpense: number
}

export function OverallGraph(props: OverallGraphProps) {
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
  const isOverBudget = remainingBudget < 0;
  const budgetColor = isOverBudget ? "text-emi" : "text-blue-700"

  const chartData = [
    {
      browser: "safari",
      visitors: props.totalExpense,
      fill: isOverBudget ? "var(--color-emi)" : "var(--color-safari)",
    },
  ]

  return (
    <Card className="ml-6 mr-6 flex w-full flex-col rounded-lg border-none shadow-lg">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg font-semibold">Overall Summary</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {month[currentMonth]}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Spend
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-around gap-2">
          <div className=" max-w-[300px] flex-1 ">
            <Card_unclick
              title="Income"
              amount={Number(props.totalIncome)}
              color="text-green-600"
              icon={HandCoins}
            />
          </div>

          <div className="max-w-[300px] flex-1">
            <SetBudget currentBudget={Number(props.budget)} />
          </div>

          <div className="max-w-[300px] flex-1">
            <Card_unclick
              title="Safe to spend per day"
              amount={Number(props.perDayBudget)}
              color={budgetColor}
              icon={Wallet}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
