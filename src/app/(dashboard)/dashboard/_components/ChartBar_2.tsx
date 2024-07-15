"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

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
const chartData = [
  { category: "Bills", spend: 20705, fill: "#0088FE" },
  { category: "EMI", spend: 10000, fill: "#00C49F" },
  { category: "Entertainment", spend: 9087, fill: "#FFBB28" },
  { category: "Foods", spend: 11173, fill: "#FF8042" },
  { category: "Others", spend: 12190, fill: "#00C49F" },
];

const chartConfig = {
  spend: {
    label: "spend",
  },
  Bills: {
    label: "Bills",
    color: "#0088FE",
  },
  EMI: {
    label: "EMI",
    color: "#00C49F",
  },
  Entertainment: {
    label: "Entertainment",
    color: "#FFBB28",
  },
  Foods: {
    label: "Foods",
    color: "#FF8042",
  },
  Others: {
    label: "Others",
    color: "#00C49F",
  },
}satisfies ChartConfig

export function ChartBar_2() {
  return (
    
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="spend" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="spend" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      
  )
}
