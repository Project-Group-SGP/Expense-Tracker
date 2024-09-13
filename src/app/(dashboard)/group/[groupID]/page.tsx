import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { cache, Suspense } from "react"
import { headers } from "next/headers"
import { Cardcontent } from "../../dashboard/_components/Card"
import Transaction from "./_components/Transaction"
import { GroupMember } from "./_components/GroupMember"
import { SettleUp } from "./_components/SettleUp"
import AddExpense from "./_components/AddExpense"
import PageTitle from "../../dashboard/_components/PageTitle"

interface Group {
  id: string
  name: string
}

interface GroupMemberDetails {
  userId: string
  name: string
  avatar: string
}

interface User {
  id: string
  name: string
  image: string
}

interface Payment {
  amount: number
}

interface Expense {
  paidBy: User[]
}

interface ExpenseSplit {
  amount: number
  expense: Expense
  payments: Payment[]
}

interface UserToPay {
  id: string
  memberName: string
  memberId: string
  amountToPay: number
  groupexpanceid: string
}

interface GetResponse {
  group: Group | null
  groupMembers: GroupMemberDetails[]
  pendingPayments: ExpenseSplit[]
  usersToPay: UserToPay[]
}

type ExpenseSplitStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID"

interface ExpenseSplit {
  userName: string
  expenseId: string
  amount: number
  isPaid: ExpenseSplitStatus
}

export interface FormattedExpenseData {
  groupId: string
  expenseId: string
  amount: number
  category: string
  paidById: string
  description: string
  date: string
  expenseSplits: ExpenseSplit[]
}

async function getAllData(groupID: string, cookie: string): Promise<GetResponse> {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/get-group?groupID=${groupID}`,
      {
        method: "GET",
        headers: { Cookie: cookie },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      throw new Error("Network response was not ok")
    }

    const data: GetResponse = await res.json()
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    return {
      group: null,
      groupMembers: [],
      pendingPayments: [],
      usersToPay: [],
    }
  }
}

async function getGroupTransactionData(groupID: string, cookie: string): Promise<FormattedExpenseData[]> {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/get-group-transaction?groupID=${groupID}`,
      {
        method: "GET",
        headers: { Cookie: cookie },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      throw new Error("Network response was not ok")
    }

    console.log("Data fetched successfully in getGroupTransactionData")

    const data: FormattedExpenseData[] = await res.json()
    console.log(data)

    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    return []
  }
}

export default async function GroupPage({
  params,
}: {
  params: { groupID: string }
}) {
  const user = await currentUserServer()
  const headersList = headers()
  const cookie = headersList.get("cookie") || ""
  if (!user) {
    redirect("/auth/signin")
  }

  const group = await db.group.findUnique({
    where: { id: params.groupID, members: { some: { userId: user.id } } },
  })

  if (!group) {
    redirect("/404")
  }

  const transactionData = await getGroupTransactionData(params.groupID, cookie)
  // console.log("Inside [groupID]/page.tsx")
  // console.log("Group 1: ", JSON.stringify(transactionData, null, 2))

  const data = await getAllData(params.groupID, cookie)

  const groupMembers = data.groupMembers
  const usersYouNeedToPay = data.usersToPay

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="mt-20 flex w-full flex-col gap-5 px-4">
          <PageTitle title={group.name} />

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
              <AddExpense
                params={{ groupID: params.groupID }}
                groupMemberName={groupMembers}
                user={user.id}
              />
              <SettleUp
                params={{ groupID: params.groupID }}
                groupMemberName={groupMembers}
                usersYouNeedToPay={usersYouNeedToPay.map((user) => ({
                  ...user,
                  expenses: [],
                }))}
                user={user.id}
              />
            </div>
          </div>

          <section className="text-bl grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
            <Cardcontent className="border-none p-0 md:col-span-2 lg:col-span-2">
              <Transaction transactionsData={transactionData} />
            </Cardcontent>
            <Cardcontent className="border-none p-0">
              <GroupMember groupMemberName={groupMembers} />
            </Cardcontent>
          </section>
        </div>
      </div>
    </Suspense>
  )
}

export const dynamic = 'force-dynamic'