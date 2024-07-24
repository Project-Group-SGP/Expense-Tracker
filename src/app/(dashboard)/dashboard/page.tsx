// Dashboard.tsx
"use client"

import { MoveDownIcon, MoveUpIcon, PiggyBankIcon } from "lucide-react";
import Card, { Cardcontent } from "./_components/Card";
import { DatePickerWithRange } from "./_components/DatePickerWithRange";
import { Dropdown_chart_1 } from "./_components/Dropdown_chart_1";
import { Dropdown_chart_2 } from "./_components/Dropdown_chart_2";
import { NewExpense } from "./_components/NewExpense";
import { Newincome } from "./_components/Newincome";
import PageTitle from "./_components/PageTitle";
import { useFinancialData } from './_hooks/useFinancialData';

const Dashboard = () => {
  const { totalIncome, totalExpense, refreshData } = useFinancialData();

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
      <div className="mt-20 flex w-full flex-col gap-5 px-4">
        <PageTitle title="Dashboard" />
        
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <p className="mr-auto">Welcome Back, Ayush 👋</p>
          <div className="ml-auto flex gap-2">
            <Newincome onSuccessfulAdd={refreshData} />
            <NewExpense onSuccessfulAdd={refreshData} />
          </div>
        </div>

        {/* Date Picker */}``
        <DatePickerWithRange />

        {/* Cards */}
        <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Remaining amount */}
          <Card
            label="Remaining"
            icon={PiggyBankIcon}
            amount={(Number(totalIncome) - Number(totalExpense)).toFixed(2)}
            description="All time"
            iconclassName="text-blue-600"
            descriptionColor="text-blue-400"
          />
          {/* Income and Expense */}
          <Card
            label="Income"
            icon={MoveUpIcon}
            amount={totalIncome}
            description="All time"
            iconclassName="text-green-600"
            descriptionColor="text-green-400"
          />
          <Card
            label="Expenses"
            icon={MoveDownIcon}
            amount={totalExpense}
            description="All time"
            iconclassName="text-red-600"
            descriptionColor="text-red-400"
          />
        </section>

        <section className="text-bl grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          
          {/* Charts */}
          <Cardcontent className="p-0 w-max-[400px] w-min-[300px]">
            <Dropdown_chart_1 />
          </Cardcontent>
          
          {/* charts */}
          <Cardcontent className="p-0">
            <Dropdown_chart_2 />
          </Cardcontent>
          
        </section>
      </div>
    </div>
  )
}

export default Dashboard;