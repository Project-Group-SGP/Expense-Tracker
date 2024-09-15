"use client";

import { Cardcontent } from "@/app/(dashboard)/dashboard/_components/Card";
import React, { useState, useEffect } from "react";
import { Category_Graph } from "./Category_Graph";
import Transaction from "@/app/(dashboard)/group/[groupID]/_components/Transaction";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const MonthSelection = ({
  data,
  budget,
}: {
  data: CategoryData;
  budget: CategoryBudget;
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    // Get all available months from the data
    const months = Object.keys(data.filteredByMonth);
    setAvailableMonths(months);
    
    // Set the initial selected month to the most recent month
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
    <div className="ml-6 mr-6 mt-20 pb-10">
      <div className="mb-6">
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[180px]">
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
      <section className="text-bl grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <Cardcontent className="border-none p-0">
          {/* Pass expenses and monthwiseTotal to Category_Graph */}
          <Category_Graph 
            data={{ 
              expenses: selectedExpenses, 
              categoryBudget: selectedMonthTotal 
            }} 
          />
        </Cardcontent>
        <Cardcontent className="border-none p-0">
          {/* Pass filtered transactions to Transaction */}
          <Transaction 
            data={{ 
              filteredByMonth: { [selectedMonth]: selectedExpenses },
              categoryBudget: {
                ...budget,
                monthwiseTotal: { [selectedMonth]: selectedMonthTotal }
              }
            }} 
          />
        </Cardcontent>
      </section>
    </div>
  );
};

export default MonthSelection;
