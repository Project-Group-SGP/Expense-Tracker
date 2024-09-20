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
import PageTitle from "./_components/PageTitle"
import TransactionTableSkeleton from "./_components/TransactionSkeleton"
import { Compatable } from "./_components/compatable"

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
  PaidByName: string
  description: string
  date: string
  status:  "UNSETTLED" | "PARTIALLY_SETTLED" | "SETTLED" | "CANCELLED";
  expenseSplits: ExpenseSplit[]
}

export interface GetBalance {
  userId: string
  name: string
  avatar: string
  amount: number
  status: 'settled up' | 'gets back' | 'owes',
  amountColor:string,
}
async function getAllData(groupID: string, cookie: string): Promise<GetResponse> {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/get-group?groupID=${groupID}`,
      {
        method: "GET",
        headers: { Cookie: cookie },
        // next: { tags: ["getGroupdata"] },
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
      pendingPayments: [],
      usersToPay: [],
    }
  }
}

const fetchGroupBalances = async (groupId: string,cookie: string):Promise<GetBalance[]> => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/balance?groupId=${groupId}`,{
        method: "GET",
        headers: { Cookie: cookie },
        // next: { tags: ["getGroupBalance"] },
        cache: 'no-store',
      });

    if (!res.ok) {
      throw new Error("Failed to fetch group balances")
    }

    const data: GetBalance[] = await res.json()

    console.log("\n\n\n\n Balance",data);
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    return [];
  }
};


async function getGroupTransactionData(groupID: string, cookie: string): Promise<FormattedExpenseData[]> {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/get-group-transaction?groupID=${groupID}`,
      {
        method: "GET",
        headers: { Cookie: cookie },
        cache: 'no-store',
        // next: { tags: ["getGroupTransactiondata"] },
      }
    )

    if (!res.ok) {
      throw new Error("Network response was not ok")
    }

    // console.log("Data fetched successfully in getGroupTransactionData")

    const data: FormattedExpenseData[] = await res.json()
    // console.log(data)

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

  // const transactionData = await getGroupTransactionData(params.groupID, cookie)
  // // console.log("Inside [groupID]/page.tsx")
  // // console.log("Group 1: ", JSON.stringify(transactionData, null, 2))

  // const data = await getAllData(params.groupID, cookie)

  const [transactionData,data,balance] = await Promise.all([getGroupTransactionData(params.groupID, cookie),getAllData(params.groupID, cookie),fetchGroupBalances(params.groupID, cookie)]);

  const groupMembers:GroupMemberDetails[] = [];

  balance.map((b)=>{groupMembers.push({userId:b.userId,avatar:b.avatar,name:b.name})})

  const usersYouNeedToPay = data.usersToPay

  const findcurrentuser = balance.find((b) => b.userId === user.id) || null;

  const leave : {
    status: 'settled up' | 'gets back' | 'owes';
    amount: number;
    userId: string;
    groupId: string;
  } =  {
    status: findcurrentuser?.status ?? "gets back",
    amount: findcurrentuser?.amount ?? 0,
    userId: findcurrentuser?.userId ?? "",
    groupId: params.groupID
  }  

  return (
      <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="mt-20 flex w-full flex-col gap-5 px-4">
          <PageTitle title={group.name} leave={leave} createrId={group.creatorId}/>
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <p>
              Welcome Back,
              <span className="text font-semibold text-orange-500 dark:text-sky-500">
                {" "}
                {user?.name.split(" ")[0]}{" "}
              </span>
              👋
            </p>
            <div className="w-full sm:ml-auto flex gap-2 sm:w-auto">
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

          {/* <section className="text-bl grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
            <Cardcontent className="border-none p-0  md:col-span-2 lg:col-span-2">
              <Transaction transactionsData={transactionData} loading={false}/>
            </Cardcontent>
            <Cardcontent className="border-none p-0 w-full">
              <GroupMember loading={false} balance={balance}/>
            </Cardcontent>
          </section> */}
          <section className="text-bl grid w-full gap-4 transition-all grid-cols-1 lg:grid-cols-3">
            <Cardcontent className="border-none p-0 col-span-1 md:col-span-2 ">
              <Transaction transactionsData={transactionData} loading={false}/>
            </Cardcontent>
            <Cardcontent className="border-none p-0 w-full col-span-1 md:col-span-1">
              <GroupMember loading={false} balance={balance} />
            </Cardcontent>
          </section>
        </div>
      </div>
  )
}

export const dynamic = 'force-dynamic'