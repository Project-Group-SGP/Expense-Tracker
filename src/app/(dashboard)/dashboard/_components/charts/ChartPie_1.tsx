"use client"

import { Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartData2 } from "./Dropdown_chart_2"
// const chartData = [
//   { category: "Bills", spend: 20705, fill: "#0088FE" },
//   { category: "EMI", spend: 10000, fill: "#00C49F" },
//   { category: "Entertainment", spend: 9087, fill: "#FFBB28" },
//   { category: "Foods", spend: 11173, fill: "#FF8042" },
//   { category: "Others", spend: 12190, fill: "#00C49F" },
// ];

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

export default function ChartPie_1({ chartData }: chartPieProps) {
  return (
    <>
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
    </>
  )
}
