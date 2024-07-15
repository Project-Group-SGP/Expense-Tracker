import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer
} from "recharts";

const chartConfig = {
  spend: {
    label: "Spend",
    color: "#2563eb"
  }
}; // satisfies ChartConfig

const chartData = [
  { month: "January", spend: 14806 },
  { month: "February", spend: 17805 },
  { month: "March", spend: 22307 },
  { month: "April", spend: 7003 },
  { month: "May", spend: 21009 },
  { month: "June", spend: 11104 },
  { month: "July", spend: 21004 },
  { month: "August", spend: 31004 },
  { month: "September", spend: 41004 }
];

export const ChartBar_1 = () => {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
          <Bar dataKey="spend" fill={chartConfig.spend.color} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};



