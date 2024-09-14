"use client"

import React from "react"
import { Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartData2 } from "../Dropdown_chart_2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartConfig = {
  spend: {
    label: "Spend",
  },
  Other: {
    label: "Other",
    color: "#A9A9A9", // Dark Gray
  },
  Bills: {
    label: "Bills",
    color: "#4169E1", // Royal Blue
  },
  Food: {
    label: "Food",
    color: "#FF6347", // Tomato Red
  },
  Entertainment: {
    label: "Entertainment",
    color: "#FFD700", // Gold
  },
  Transportation: {
    label: "Transportation",
    color: "#4682B4", // Steel Blue
  },
  EMI: {
    label: "EMI",
    color: "#DC143C", // Crimson
  },
  Healthcare: {
    label: "Healthcare",
    color: "#20B2AA", // Light Sea Green
  },
  Education: {
    label: "Education",
    color: "#9370DB", // Medium Purple
  },
  Investment: {
    label: "Investment",
    color: "#228B22", // Forest Green
  },
  Shopping: {
    label: "Shopping",
    color: "#FF69B4", // Hot Pink
  },
  Fuel: {
    label: "Fuel",
    color: "#FFA500", // Orange
  },
  Groceries: {
    label: "Groceries",
    color: "#32CD32", // Lime Green
  },
} satisfies ChartConfig;

export type chartPieProps = {
  chartData: ChartData2[]
}

// Catagory label
const Catagory_label = ({ data }) => (
  <div className="flex flex-wrap justify-center gap-2 mb-4">
    {data.map((item, index) => (
      <div key={index} className="flex items-center">
        <div
          className="w-3 h-3 mr-1 rounded-full"
          style={{ backgroundColor: chartConfig[item.category]?.color }}
        ></div>
        <span className="text-sm">{item.category}</span>
      </div>
    ))}
  </div>
)

export default function ChartPie_1({ chartData }: chartPieProps) {
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="spend" nameKey="category" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}