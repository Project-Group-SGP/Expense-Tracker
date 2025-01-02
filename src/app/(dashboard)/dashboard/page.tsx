import { currentUserServer } from "@/lib/auth"
import { format, subMonths } from "date-fns"
import { MoveDownIcon, MoveUpIcon, PiggyBankIcon } from "lucide-react"
import { headers } from "next/headers"
import { cache, Suspense } from "react"
import Card, { Cardcontent } from "./_components/Card"
import DateSelect from "./_components/DateSelect"
import { Dropdown_chart_1 } from "./_components/Dropdown_chart_1"
import { Dropdown_chart_2 } from "./_components/Dropdown_chart_2"
import { NewExpense } from "./_components/NewExpense"
import { Newincome } from "./_components/Newincome"
import PageTitle from "./_components/PageTitle"
import AIInsight from "./_components/AIInsight"
import { RecurringButton } from "./_components/RecurringButton"

type FinancialData = {
  income: number
  expense: number
}

const getTotalIncomeExpense = cache(
  async (id: string, cookie: string, startDate: string, endDate: string): Promise<FinancialData> => {
    try {
      const res = await fetch(`${process.env.BASE_URL}/api/total-income-expense?&startDate=${startDate}&endDate=${endDate}`, {
        method: "GET",
        headers: { Cookie: cookie },
        next: { tags: ["total-income-expense"] },
        cache: "force-cache",
      })
      if (!res.ok) throw new Error("Failed to fetch total income")
      const data = await res.json()
      console.log(data);
      
      return data;
    } catch (error) {
      return { income: 0, expense: 0}
    }
  }
)

type Expense = {
  id: string
  userId: string
  category: string
  amount: string
  date: string
  description: string
}

type Income = {
  id: string
  userId: string
  category: string
  amount: string
  date: string
  description: string
}

export type FinancialData_ = {
  expense: Expense[]
  income: Income[]
}

const getAllData = cache(
  async (
    id: string,
    cookie: string,
    startDate: string,
    endDate: string
  ): Promise<FinancialData_> => {
    try {
      const res = await fetch(
        `${process.env.BASE_URL}/api/allData?&startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: { Cookie: cookie  },
          next: {
            tags: ["getAllData"],
          },
          cache: "no-store",
        }
      )

      if (!res.ok) throw new Error("Failed to fetch all financial data")

      const data: FinancialData_ = await res.json()
      return data
    } catch (error) {
      return { expense: [], income: [] }
    }
  }
)

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const headersList = headers()
  const cookie = headersList.get("cookie") || ""
  const user = await currentUserServer()

  if (!user) {
    return <div>Please log in to view your dashboard.</div>
  }

  const startDate =
    searchParams?.startDate ||
    format(subMonths(new Date(), 1), "yyyy-MM-dd") ||
    ""
  const endDate =
    searchParams?.endDate || format(new Date(), "yyyy-MM-dd") || ""

  const [ total , Data] = await Promise.all([
    getTotalIncomeExpense(user.id, cookie, startDate, endDate),
    getAllData(user.id, cookie, startDate, endDate),
  ])

  // console.log(total);
  

  return (
    <Suspense>
      <div className="relative mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="mt-20 flex w-full flex-col gap-5 px-4">
          <PageTitle title="Dashboard" />

          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <p className="mr-auto">
              Welcome Back,
              <span className="text font-semibold text-orange-500 dark:text-sky-500">
                {" "}
                {user?.name.split(" ")[0]}{" "}
              </span>
              👋
            </p>
            <div className="mt-4 flex w-full flex-col items-stretch gap-2 sm:mt-0 sm:w-auto sm:flex-row sm:items-center">
              <Newincome />
              <NewExpense />
              <RecurringButton />
            </div>
          </div>
            <DateSelect />

          <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              label="Remaining"
              icon={PiggyBankIcon}
              amount={(total.income - total.expense).toFixed(2)}
              description="All time"
              iconclassName="text-blue-600"
              descriptionColor="text-blue-400"
            />
            <Card
              label="Income"
              icon={MoveUpIcon}
              amount={total.income.toFixed(2)}
              description="All time"
              iconclassName="text-green-600"
              descriptionColor="text-green-400"
            />
            <Card
              label="Expenses"
              icon={MoveDownIcon}
              amount={total.expense.toFixed(2)}
              description="All time"
              iconclassName="text-red-600"
              descriptionColor="text-red-400"
            />
          </section>


          <section className="w-full space-y-4 md:flex md:space-x-4 md:space-y-0">
            <Cardcontent className="w-full p-4 md:w-1/2">
              <Dropdown_chart_1 data={Data} />
            </Cardcontent>

            <Cardcontent className="w-full p-4 md:w-1/2">
              <Dropdown_chart_2 data={Data} />
            </Cardcontent>
          </section>
        </div>

        <AIInsight />
      </div>
    </Suspense>
  )
}
