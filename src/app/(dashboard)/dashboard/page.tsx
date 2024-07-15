import Card from "./_components/Card"
import { DatePickerWithRange } from "./_components/DatePickerWithRange"
import Navbar from "./_components/Navbar"
import * as React from "react"
import PageTitle from "./_components/PageTitle"
import { IndianRupee, MoveDownIcon, MoveDownRight, MoveUpIcon, PiggyBank, PiggyBankIcon } from "lucide-react"
import { Cardcontent } from "./_components/Card"

import ChartBar_1 from "./_components/ChartBar_1"
import { ChartBar_2 } from "./_components/ChartBar_2"
import { ChartBar_3 } from "./_components/ChartBar_3"

import ChartPie_1 from "./_components/ChartPie_1"
import ChartPie_2 from "./_components/ChartPie_2"
import ChartPie_3 from "./_components/ChartPie_3"
import { ChartBar_4 } from "./_components/ChartBar_4"

const Dashboard = () => {
  return (
    <>
     
      <div className="mt-20 flex w-full flex-col gap-5 px-4">
        {/* Title */}
        <PageTitle title="Dashboard" />

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
          <Cardcontent className="p-0">
            <p className="p-4 font-semibold">Transactions</p>
            <div className="p-4">
              {/* <ChartBar_1 /> */}
              <ChartBar_3 />
              {/* <ChartBar_4 /> */}
            </div>
          </Cardcontent>
          <Cardcontent >
            <p className="p-4 font-semibold">Expenses</p>
            <div>
              {/* <ChartPie_1/> */}
              <ChartPie_2 />
              {/* <ChartBar_2 /> */}
              {/* <ChartPie_3/> */}
            </div>
          </Cardcontent>
        </section>
      </div>
    </>
  )
}

export default Dashboard
