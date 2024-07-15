import Card from "./_components/Card"
import { DatePickerWithRange } from "./_components/DatePickerWithRange"

import * as React from "react"
import PageTitle from "./_components/PageTitle"
import { IndianRupee, MoveDownIcon, MoveDownRight, MoveUpIcon, PiggyBank, PiggyBankIcon } from "lucide-react"
import { Cardcontent } from "./_components/Card"


import { ChartBar_3 } from "./_components/ChartBar_3"


import ChartPie_2 from "./_components/ChartPie_2"
import { Dropdown_chart_1 } from "./_components/Dropdown_chart_1"
import { Dropdown_chart_2 } from "./_components/Dropdown_chart_2"


const Dashboard = () => {
  return (
    <>
     
      <div className="mt-20 flex w-full flex-col gap-5 px-4">
        {/* Title */}
        <PageTitle title="Dashboard" />

        <div>
          Welcome Back , Ayush 👋
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
            amount="0"
            description="Last month"
            iconclassName="text-blue-600"
            descriptionColor="text-blue-400"
          />
          <Card
            label="Income"
            icon={MoveUpIcon}
            amount="0"
            description="Last month"
            iconclassName="text-green-600"
            descriptionColor="text-green-400"
          />
          <Card
            label="Expenses"
            icon={MoveDownIcon}
            amount="0"
            description="Last month"
            iconclassName="text-red-600"
            descriptionColor="text-red-400"
          />
        </section>
        {/* charts */}
        <section className="grid gap-4 w-full transition-all text-bl md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2">
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
