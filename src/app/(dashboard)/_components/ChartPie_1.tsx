
"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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
} satisfies ChartConfig

export default function ChartBar_1() {
  return (<>

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
        </>)
}
