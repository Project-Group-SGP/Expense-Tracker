"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { chartPieProps } from "./ChartPie_1"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartConfig = {
  spend: {
    label: "Spend",
  },
  Other: {
    label: "Other",
    color: "hsl(0, 0%, 53%)", // #888888
  },
  Bills: {
    label: "Bills",
    color: "hsl(209, 100%, 50%)", // #0088FE
  },
  Food: {
    label: "Food",
    color: "hsl(22, 100%, 63%)", // #FF8042
  },
  Entertainment: {
    label: "Entertainment",
    color: "hsl(44, 100%, 58%)", // #FFBB28
  },
  Transportation: {
    label: "Transportation",
    color: "hsl(168, 100%, 39%)", // #00C49F
  },
  EMI: {
    label: "EMI",
    color: "hsl(0, 100%, 50%)", // #FF0000
  },
  Healthcare: {
    label: "Healthcare",
    color: "hsl(300, 100%, 25%)", // #800080
  },
  Education: {
    label: "Education",
    color: "hsl(180, 100%, 50%)", // #00FFFF
  },
  Investment: {
    label: "Investment",
    color: "hsl(120, 100%, 25%)", // #008000
  },
  Shopping: {
    label: "Shopping",
    color: "hsl(51, 100%, 50%)", // #FFD700
  },
  Fuel: {
    label: "Fuel",
    color: "hsl(9, 100%, 64%)", // #FF6347
  },
  Groceries: {
    label: "Groceries",
    color: "hsl(84, 100%, 59%)", // #ADFF2F
  },
} satisfies ChartConfig

// Catagory label
const Catagory_label = ({ data }) => (
  <div className="flex flex-wrap justify-center gap-2 mb-4">
    {data.map((item, index) => (
      <div key={index} className="flex items-center">
        <div
          className="w-3 h-3 mr-1  rounded-full"
          style={{ backgroundColor: chartConfig[item.category]?.color }}
        ></div>
        <span className="text-sm">{item.category}</span>
      </div>
    ))}
  </div>
)


export default function ChartPie_2({ chartData }: chartPieProps) {
  const totalSpend = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.spend, 0)
  }, [chartData])

  return (
    <Card className="w-full max-w-3xl mx-auto dark:bg-black shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-center">Expense Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <Catagory_label data={chartData} />
      
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          // @ts-ignore
          content={<ChartTooltipContent nameKey="category" valueKey="spend" />}
        />
        <Pie
          data={chartData}
          dataKey="spend"
          nameKey="category"
          innerRadius={60}
          strokeWidth={5}
        >
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
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalSpend.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      spend
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
    </CardContent>
    </Card>
  )
}
