import { MoveDownIcon, MoveUpIcon, PiggyBankIcon } from "lucide-react"
import Card, { Cardcontent } from "./_components/Card"
import { DatePickerWithRange } from "./_components/DatePickerWithRange"
import { Dropdown_chart_1 } from "./_components/Dropdown_chart_1"
import { Dropdown_chart_2 } from "./_components/Dropdown_chart_2"
import { NewExpense } from "./_components/NewExpense"
import { Newincome } from "./_components/Newincome"
import PageTitle from "./_components/PageTitle"
import { headers } from "next/headers"
import { currentUserServer } from "@/lib/auth"
import { cache, Suspense } from "react"

type FinancialData = {
  amount: number
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"

const getTotalIncome = cache(
  async (id: string, cookie: string): Promise<FinancialData> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/totalIncome?userId=${id}`, {
        method: "GET",
        headers: { Cookie: cookie },
        next: { tags: ["totalIncome"] },
      })
      if (!res.ok) throw new Error("Failed to fetch total income")
      const data = await res.json()
      return { amount: Number(data) || 0 }
    } catch (error) {
      console.error("Error fetching total income:", error)
      return { amount: 0 }
    }
  }
)

const getTotalExpense = cache(
  async (id: string, cookie: string): Promise<FinancialData> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/totalExpense?userId=${id}`, {
        method: "GET",
        headers: { Cookie: cookie },
        next: { tags: ["totalExpense"] },
      })
      if (!res.ok) throw new Error("Failed to fetch total expense")
      const data = await res.json()
      return { amount: Number(data) || 0 }
    } catch (error) {
      console.error("Error fetching total expense:", error)
      return { amount: 0 }
    }
  }
)

// Define the type for your API response
type Expense = {
  id: string
  userId: string
  category: string
  amount: string
  date: string
  description: string
}

export type FinancialData_ = {
  expense: Expense[]
  // Add other properties if needed based on your API response
}

const getAllData = cache(
  async (id: string, cookie: string): Promise<FinancialData_> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/allData?userId=${id}`, {
        method: "GET",
        headers: { Cookie: cookie },
        next: { tags: ["getAllData"] },
      })

      if (!res.ok) throw new Error("Failed to fetch All expenses")

      const data: FinancialData_ = await res.json()

      // // Log the entire data object
      // console.log("All data from getAllData:", JSON.stringify(data, null, 2));

      // Return the raw data
      return data
    } catch (error) {
      console.error("Error fetching data:", error)
      return { expense: [] } // Return an empty array or adjust based on your data structure
    }
  }
)

export default async function Dashboard() {
  console.log("SERVER: Rendering Dashboard...")
  const headersList = headers()
  const cookie = headersList.get("cookie") || ""
  const user = await currentUserServer()

  if (!user) {
    return <div>Please log in to view your dashboard.</div>
  }

  const totalIncome = await getTotalIncome(user.id, cookie)
  const totalExpense = await getTotalExpense(user.id, cookie)
  const Data = await getAllData(user.id, cookie)

  const incomeAmount = totalIncome?.amount ?? 0
  const expenseAmount = totalExpense?.amount ?? 0

  return (
    <Suspense>
      <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
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
            <div className="ml-auto flex gap-2">
              <Newincome />
              <NewExpense />
            </div>
          </div>

          <DatePickerWithRange />

          <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              label="Remaining"
              icon={PiggyBankIcon}
              amount={(incomeAmount - expenseAmount).toFixed(2)}
              description="All time"
              iconclassName="text-blue-600"
              descriptionColor="text-blue-400"
            />
            <Card
              label="Income"
              icon={MoveUpIcon}
              amount={incomeAmount.toFixed(2)}
              description="All time"
              iconclassName="text-green-600"
              descriptionColor="text-green-400"
            />
            <Card
              label="Expenses"
              icon={MoveDownIcon}
              amount={expenseAmount.toFixed(2)}
              description="All time"
              iconclassName="text-red-600"
              descriptionColor="text-red-400"
            />
          </section>

          <section className="text-bl grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <Cardcontent className="w-max-[400px] w-min-[300px] p-0">
              {/* get all data and pass it */}
              <Dropdown_chart_1 data={Data} />
            </Cardcontent>

            <Cardcontent className="p-0">
              <Dropdown_chart_2 data={Data} />
            </Cardcontent>
          </section>
        </div>
      </div>
    </Suspense>
  )
}
