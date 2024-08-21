"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePathname } from "next/navigation";
import { CategoryTypes } from "@prisma/client";
import { GetExpensesData } from "../action";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type Expense = {
  id: string;
  userId: string;
  category: string;
  amount: string;
  date: string;
  description: string;
};

export type Expenses = Expense[];

// month wise category data


function getMonthName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'long' });
}

export function Category_Graph({ data }: { data: Expenses }) {
  const pathname = usePathname();
  const lastRouteName = pathname?.split("/").pop();
  console.log("Last Route Name:", lastRouteName);

  // console.log("Data:", data);

  const categoryWiseData: { [key: string]: number } = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };
  
  // Filter data for the specific category
  const targetCategory = lastRouteName?.toUpperCase() || '';
  data.filter(transaction => transaction.category.toLowerCase() === targetCategory.toLowerCase()).forEach(transaction => {
   
    // Update categoryWiseData
    const month = getMonthName(transaction.date);
    if (categoryWiseData[month] !== undefined) {
      categoryWiseData[month] += parseFloat(transaction.amount);
    }
  });

  // Convert the categoryWiseData object to an array for the BarChart
  const chartData = Object.entries(categoryWiseData).map(([month, spend]) => ({ month, spend }));

  // console.log(chartData);
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>{lastRouteName?.toUpperCase()}</CardTitle>
        <CardDescription>All month Data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend />
            <Bar dataKey="spend" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}