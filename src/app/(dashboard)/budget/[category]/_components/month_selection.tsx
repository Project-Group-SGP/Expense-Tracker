'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category_Graph } from "./Category_Graph";
import Transaction from "./Transaction";
import { CalendarIcon, TrendingUpIcon, ListIcon } from "lucide-react";

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

export default function Component({ data, budget }: MonthSelectionProps) {
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
      <Card className="mb-8 bg-gradient-to-r ">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Monthly Expense Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-8 w-8 text-blue-600/70" />
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[200px]  bg-blue-600/5 border-blue-600/20 text-blue-600 hover:bg-blue-600/10 focus:ring-blue-600/30">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent className="bg-background border-blue-600/20">
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month} className="hover:bg-blue-600/10 focus:bg-blue-600/20 cursor-pointer">
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <p className="text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold">${selectedMonthTotal.toFixed(2)}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <p className="text-sm font-medium">Number of Transactions</p>
              <p className="text-2xl font-bold">{selectedExpenses.length}</p>
            </div>
          </div> */}
        </CardContent>
      </Card>
      <div className="grid gap-8 md:grid-cols-2 ">
        <Card className="shadow-lg transition-all rounded-lg duration-300 hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r rounded-lg ">
            <CardTitle className="flex items-center text-xl font-semibold text-green-500">
              <TrendingUpIcon className="mr-2 h-6 w-6 rounded-lg " />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Category_Graph
              data={{
                expenses: selectedExpenses,
              }}
            />
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r rounded-lg ">
            <CardTitle className="flex items-center text-xl font-semibold text-blue-600">
              <ListIcon className="mr-2 h-6 w-6" />
              Transaction Details
            </CardTitle>
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