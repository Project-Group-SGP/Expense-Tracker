"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { chartPieProps } from "./ChartPie_1"

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

export function ChartBar_2({ chartData }: chartPieProps) {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 100, // Increased left margin for better visibility of labels
          right: 20,
          top: 20,
          bottom: 20,
        }}
      >
        <YAxis
          dataKey="category"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={90} // Set a fixed width for the Y-axis
          tickFormatter={(value) =>
            chartConfig[value as keyof typeof chartConfig]?.label
          }
        />
        <XAxis dataKey="spend" type="number" />
        <ChartTooltip
          cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
          //@ts-ignore
          content={<ChartTooltipContent nameKey="category" valueKey="spend" />}
        />
        <Bar
          dataKey="spend"
          //@ts-ignore
          fill={(entry) =>
            //@ts-ignore
            chartConfig[entry.category as keyof typeof chartConfig]?.color ||
            "#000000"
          }
          radius={[0, 5, 5, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
