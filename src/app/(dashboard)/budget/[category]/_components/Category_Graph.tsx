'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { usePathname } from "next/navigation";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type Expense = {
  id: string;
  userId?: string;
  category: string;
  amount: string;
  date: string;
  description: string;
};

export type Expenses = Expense[];

function getMonthName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'long' });
}

// Typing the data prop with expenses as an array of Expense and categoryBudget as a number
export function Category_Graph({ data }: { data: { expenses: Expenses; } }) {
  const pathname = usePathname();
  const lastRouteName = pathname?.split("/").pop()?.toUpperCase() || '';

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

  // Filter and aggregate data for the specific category
  const targetCategory = lastRouteName;
  data.expenses
    .filter(transaction => transaction.category.toUpperCase() === targetCategory)
    .forEach(transaction => {
      const month = getMonthName(transaction.date);
      if (categoryWiseData[month] !== undefined) {
        categoryWiseData[month] += parseFloat(transaction.amount);
      }
    });

  
    // Convert the categoryWiseData object to an array for the BarChart
  
  const chartData = Object.entries(categoryWiseData).map(([month, spend]) => ({
    month, 
    spend: spend as number  // Explicit type for the 'spend' field
  }));


  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>{lastRouteName}</CardTitle>
        <CardDescription>This month's Data</CardDescription>
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
              tickFormatter={(value) => value.slice(0, 3)} // Format month names to 3 letters
            />
            <YAxis />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />} // Use custom tooltip content
            />
            <Legend />
            <Bar dataKey="spend" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
