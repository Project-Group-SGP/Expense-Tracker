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
    color: "#888888",
  },
  Bills: {
    label: "Bills",
    color: "#0088FE",
  },
  Food: {
    label: "Food",
    color: "#FF8042",
  },
  Entertainment: {
    label: "Entertainment",
    color: "#FFBB28",
  },
  Transportation: {
    label: "Transportation",
    color: "#00C49F",
  },
  EMI: {
    label: "EMI",
    color: "#FF0000",
  },
  Healthcare: {
    label: "Healthcare",
    color: "#800080",
  },
  Education: {
    label: "Education",
    color: "#00FFFF",
  },
  Investment: {
    label: "Investment",
    color: "#008000",
  },
  Shopping: {
    label: "Shopping",
    color: "#FFD700",
  },
  Fuel: {
    label: "Fuel",
    color: "#FF6347",
  },
  Groceries: {
    label: "Groceries",
    color: "#ADFF2F",
  },
} satisfies ChartConfig

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