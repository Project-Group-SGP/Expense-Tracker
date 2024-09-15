'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category_Graph } from "./Category_Graph";
import Transaction from "./Transaction";
import { CalendarIcon } from "lucide-react";

interface Expense {
  id: string;
  category: string;
  amount: string;
  date: string;
  description: string;
}

interface CategoryData {
  filteredByMonth: {
    [month: string]: Expense[];
  };
}

interface Budget {
  id: string;
  userId: string;
  category: string;
  budget: string;
}

interface CategoryBudget {
  budget: Budget;
  monthwiseTotal: {
    [month: string]: number;
  };
}

interface MonthSelectionProps {
  data: CategoryData;
  budget: CategoryBudget;
}

export default function MonthSelection({ data, budget }: MonthSelectionProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    const months = Object.keys(data.filteredByMonth);
    setAvailableMonths(months);
    if (months.length > 0) {
      setSelectedMonth(months[months.length - 1]);
    }
  }, [data]);

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const selectedExpenses = data.filteredByMonth[selectedMonth] || [];
  const selectedMonthTotal = budget.monthwiseTotal[selectedMonth] || 0;

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Monthly Expense Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-6 w-6 text-gray-500" />
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Category_Graph
              data={{
                expenses: selectedExpenses,
              }}
            />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Transaction
              data={{
                expenses: selectedExpenses,
                categoryBudget: budget.monthwiseTotal,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}