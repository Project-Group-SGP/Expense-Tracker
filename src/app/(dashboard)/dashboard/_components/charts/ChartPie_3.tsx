"use client"

import { LabelList, RadialBar, RadialBarChart } from "recharts"
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

// Catagory label
const Catagory_label = ({ data }) => (
  <div className="mb-4 flex flex-wrap justify-center gap-2">
    {data.map((item, index) => (
      <div key={index} className="flex items-center">
        <div
          className="mr-1 h-3 w-3  rounded-full"
          style={{ backgroundColor: chartConfig[item.category]?.color }}
        ></div>
        <span className="text-sm">{item.category}</span>
      </div>
    ))}
  </div>
)

export default function ChartPie_3({ chartData }: chartPieProps) {
  return (
    <Card className="mx-auto w-full max-w-3xl dark:bg-black shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-center">Expense Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <Catagory_label data={chartData} />

        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
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
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
