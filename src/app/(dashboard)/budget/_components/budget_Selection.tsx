'use client'

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from 'lucide-react';
import { OverallGraph } from './OverallGraph';
import CategoryList from './CategoryList';

type CategoryBudget = {
  [key: string]: number;
};

type MonthlyData = {
  month: string;
  totalIncome: number;
  totalExpense: number;
  categoryExpenses: CategoryBudget;
  categoryBudget: CategoryBudget;
  remainingBudget: number;
};

type BudgetSelectionProps = {
  initialData: {
    monthlyData: MonthlyData[];
  };
  budget: number;
};

const BudgetSelection: React.FC<BudgetSelectionProps> = ({ initialData, budget }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthChange = (value: string) => {
    setSelectedMonth(parseInt(value, 10));
  };

  // Ensure selectedMonth is valid and prevent potential errors
  const selectedData = initialData.monthlyData[selectedMonth] || {
    totalIncome: 0,
    totalExpense: 0,
    categoryExpenses: {},
    categoryBudget: {},
    remainingBudget: 0
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-background rounded-lg shadow-none">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center">Budget Overview</h1>
        <div className="w-full ml-10 sm:w-[200px]">
          <Select onValueChange={handleMonthChange} defaultValue={selectedMonth.toString()}>
            <SelectTrigger className="w-full bg-blue-600/5 border-blue-600/20 text-blue-600 hover:bg-blue-600/10 focus:ring-blue-600/30">
              <CalendarIcon className="mr-2 h-4 w-4 text-blue-600/70" />
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent className="bg-background border-blue-600/20">
              {months.map((month, index) => (
                <SelectItem
                  key={index}
                  value={index.toString()}
                  className="hover:bg-blue-600/10 focus:bg-blue-600/20 cursor-pointer"
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        <OverallGraph monthlyData={initialData.monthlyData} budget={budget} selectedMonth={selectedMonth} />
        <CategoryList categories={selectedData.categoryExpenses} />
      </div>
    </div>
  );
};

export default BudgetSelection;
