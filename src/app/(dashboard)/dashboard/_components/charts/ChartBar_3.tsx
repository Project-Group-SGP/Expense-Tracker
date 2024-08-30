"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartData1 } from "../Dropdown_chart_1"

const chartConfig = {
  spend: {
    label: "spend",
    color: "#2563eb",
  },
} // satisfies ChartConfig

export type chartDataBar1 = {
  chartData: ChartData1[]
}

export function ChartBar_3({ chartData }: chartDataBar1) {
  // console.log("inside ChartBar_3")

  // console.log(chartData)

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="month"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          {/* <Tooltip content={<ChartTooltipContent />} /> */}
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="spend" fill={chartConfig.spend.color} radius={5} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
