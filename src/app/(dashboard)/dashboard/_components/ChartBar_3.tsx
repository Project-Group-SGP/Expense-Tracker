"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

const chartData = [
  { month: "January", spend: 14806 },
  { month: "February", spend: 17805 },
  { month: "March", spend: 22307 },
  { month: "April", spend: 7003 },
  { month: "May", spend: 21009 },
  { month: "June", spend: 11104 },
  { month: "July", spend: 21004 },
  { month: "August", spend: 31004 },
  { month: "September", spend: 41004 },
];

const chartConfig = {
  spend: {
    label: "Spend",
    color: "#2563eb",
  },
}; // satisfies ChartConfig

export function ChartBar_3() {
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
  );
}
