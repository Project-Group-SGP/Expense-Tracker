"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { categories: "Bills", spend: 275, fill: "#0088FE" },
  { categories: "EMI", spend: 200, fill: "#00C49F"},
  { categories: "Entertainment", spend: 287, fill: "#FFBB28" },
  { categories: "Foods", spend: 173, fill: "#FF8042" },
  { categories: "other", spend: 190, fill: "#00C49F" },
]


const chartConfig = {
  spend: {
    label: "spend",
  },
  Bills: {
    label: "Bills",
    color: "hsl(var(--chart-1))",
  },
  EMI: {
    label: "EMI",
    color: "hsl(var(--chart-2))",
  },
  Entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-3))",
  },
  Foods: {
    label: "Foods",
    color: "hsl(var(--chart-4))",
  },
  Others: {
    label: "Others",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export default function ChartPie_2() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.spend, 0)
  }, [])

  return (
    
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="spend"
              nameKey="categories"
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
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Spend
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
     
  )
}
