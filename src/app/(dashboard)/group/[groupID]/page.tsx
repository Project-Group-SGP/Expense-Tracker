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
import {GroupID} from "./GroupID"
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
        next: { tags: ["getGroupdata"] },
        cache: "no-cache",
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
      usersToPay: [],
    }
  }
}

const fetchGroupBalances = async (groupId: string,cookie: string):Promise<GetBalance[]> => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/balance?groupId=${groupId}`,{
        method: "GET",
        headers: { Cookie: cookie },
        next: { tags: ["getGroupBalance"] },
        cache: "no-cache",
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
        cache: "no-cache",
        next: { tags: ["getGroupTransactiondata"] },
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
    <GroupID group={group} balance={balance} groupMembers={groupMembers} leave={leave} transactionData={transactionData} name={user?.name} usersYouNeedToPay={usersYouNeedToPay} user={user.id}/>
  )
}
