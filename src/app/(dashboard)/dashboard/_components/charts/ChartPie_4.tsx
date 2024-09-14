"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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
import { chartPieProps } from "./ChartPie_1"

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


// Catagory label
const Catagory_label = ({ data }) => (
  <div className="flex flex-wrap justify-center gap-2 mb-4 ">
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


export function ChartPie_4({ chartData }: chartPieProps) {
  return (
    <Card className="mx-auto w-full max-w-3xl dark:bg-black shadow-none border-none">
    <CardHeader>
      <CardTitle className="text-center">Expense Distribution</CardTitle>
    </CardHeader>
    <CardContent>
      <Catagory_label data={chartData} />
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="category" />
            <PolarGrid />
            <Radar
              dataKey="spend"
              fill="#EE4B2B"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </CardContent>
    </Card>
  )
}
