import Card from "./_components/Card"
import { DatePickerWithRange } from "./_components/DatePickerWithRange"

import { MoveDownIcon, MoveUpIcon, PiggyBankIcon } from "lucide-react"
import { Cardcontent } from "./_components/Card"
import PageTitle from "./_components/PageTitle"

import { Dropdown_chart_1 } from "./_components/Dropdown_chart_1"
import { Dropdown_chart_2 } from "./_components/Dropdown_chart_2"


import { Button } from "@/components/ui/button"
import { Newincome } from "./_components/Newincome"
import { NewExpense } from "./_components/NewExpense"

const Dashboard = () => {
  return (
    <>
      <div className="mt-20 flex w-full flex-col gap-5 px-4">
        {/* Title */}
        <PageTitle title="Dashboard" />

        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <p className="mr-auto">Welcome Back, Ayush 👋</p>
          <div className="ml-auto flex gap-2">
           

            <Newincome />

            <NewExpense />
          </div>
        </div>

        {/* Date picker */}
        <div className="my-4">
          <DatePickerWithRange />
        </div>

        {/* Cards */}
        <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card
            label="Remaining"
            icon={PiggyBankIcon}
            amount="150000"
            description="Last month"
            iconclassName="text-blue-600"
            descriptionColor="text-blue-400"
          />
          <Card
            label="Income"
            icon={MoveUpIcon}
            amount="295000"
            description="Last month"
            iconclassName="text-green-600"
            descriptionColor="text-green-400"
          />
          <Card
            label="Expenses"
            icon={MoveDownIcon}
            amount="95000"
            description="Last month"
            iconclassName="text-red-600"
            descriptionColor="text-red-400"
          />
        </section>
        {/* charts */}
        <section className="text-bl grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {/* chart 1 */}
          <Cardcontent className="p-0">
            <Dropdown_chart_1 />
          </Cardcontent>

          {/* chart 2 */}
          <Cardcontent className="p-0">
            <Dropdown_chart_2 />
          </Cardcontent>
        </section>
      </div>
    </>
  )
}

export default Dashboard
