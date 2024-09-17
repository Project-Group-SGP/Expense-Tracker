import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis
} from "recharts";
import { chartDataBar1 } from "./ChartBar_3";

const chartConfig = {
  spend: {
    label: "Spend",
    color: "#2563eb"
  }
}; // satisfies ChartConfig


export const ChartBar_1 = ({chartData}:chartDataBar1) => {
  

  return (
    <ChartContainer config={chartConfig} className="h-full">
      <ResponsiveContainer  height={300}>
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



