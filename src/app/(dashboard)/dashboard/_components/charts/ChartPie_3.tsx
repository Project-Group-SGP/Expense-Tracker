"use client"

import { LabelList, RadialBar, RadialBarChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartData2 } from "../Dropdown_chart_2"
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

export default function ChartPie_3({ chartData }: chartPieProps) {
  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={-90}
          endAngle={380}
          innerRadius={30}
          outerRadius={110}
        >
          <ChartTooltip
            cursor={false}
            content={
              // @ts-ignore
              <ChartTooltipContent nameKey="category" valueKey="spend" />
            }
          />
          <RadialBar dataKey="spend" background>
            <LabelList
              position="insideStart"
              dataKey="category"
              className="fill-white capitalize mix-blend-luminosity"
              fontSize={11}
            />
          </RadialBar>
        </RadialBarChart>
      </ChartContainer>
    </>
  )
}
