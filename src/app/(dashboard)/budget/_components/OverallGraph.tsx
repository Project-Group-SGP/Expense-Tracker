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
import CateroyCard from "./Card_Category"
import { HandCoins, CircleGauge, Wallet } from 'lucide-react'
import Card_click from "./Card_click"

const chartData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]

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
    totalIncome: number,
    budget: number,
    perDayBudget: number,
}

export function OverallGraph(props:OverallGraphProps) {
  return (
    <Card className="flex flex-col ml-6 w-full mr-6 border-none shadow-lg rounded-lg">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">Overall Summary</CardTitle>
        {/* give options for selecting month and year */}
        <CardDescription className="text-sm text-gray-500">January 2024</CardDescription>
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
  <div className="flex justify-around gap-2 w-full">
    <CateroyCard
      title="Income"
      amount={Number(props.totalIncome)}
      color="text-green-600"
      icon={HandCoins}
    />
    <CateroyCard
      title="Set Budget"
      amount={Number(props.budget)}
      color="text-blue-700"
      icon={CircleGauge}
    />
    <CateroyCard
      title="Safe to spend per day"
      amount={Number(props.perDayBudget)}
      color="text-sky-400"
      icon={Wallet}
    />
  </div>
</CardFooter>

    </Card>
  )
}
