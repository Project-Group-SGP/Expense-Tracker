"use client"
import { Cardcontent } from "../../dashboard/_components/Card"
import Transaction from "./_components/Transaction"
import { GroupMember } from "./_components/GroupMember"
import { SettleUp } from "./_components/SettleUp"
import AddExpense from "./_components/AddExpense"
import PageTitle from "./_components/PageTitle"
import { TransactionSummary } from "./group"


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

 interface FormattedExpenseData {
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

 interface GetBalance {
  userId: string
  name: string
  avatar: string
  amount: number
  status: 'settled up' | 'gets back' | 'owes',
  amountColor:string,
  detailedBalance: DetailedBalance[]
}

// In GroupMember.tsx
interface  GroupID{
  group:{
    id: string;
    name: string;
    description: string | null;
    photo: string | null;
    code: string;
    creatorId: string;
},
  leave: {
    status: 'settled up' | 'gets back' | 'owes';
    amount: number;
    userId: string;
    groupId: string;
  },
  transactionData:FormattedExpenseData[],
  balance:GetBalance[],
  name:string,
  groupMembers:GroupMemberDetails[],
  settleup: TransactionSummary[],
  user:string,
}

interface DetailedBalance {
  userId: string
  name: string
  amount: string
  status: 'gets back' | 'owes'
}

interface GroupMemberBalance {
  userId: string
  name: string
  status: 'settled up' | 'gets back' | 'owes'
  amount: number // Keep amount as number
  amountColor: string
  avatar: string
  detailedBalance: DetailedBalance[]
}

export const GroupID = ({group,leave,transactionData,balance,name,groupMembers,settleup,user}:GroupID) => {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="mt-20 flex w-full flex-col gap-5 px-4">
          <PageTitle title={group.name ?? ""} leave={leave} createrId={group.creatorId ?? ""}/>
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <p>
              Welcome Back,
              <span className="text font-semibold text-orange-500 dark:text-sky-500">
                {" "}
                {name.split(" ")[0]}{" "}
              </span>
              👋
            </p>
            <div className="w-full sm:ml-auto flex gap-2 sm:w-auto">
            <AddExpense
                params={{ groupID: group.id||"" }}
                groupMemberName={groupMembers}
                user={user}
              />
              <SettleUp
                params={{ groupID: group.id ||""}}
                groupMemberName={groupMembers}
                settleup={settleup}
                user={user}
              />
            </div>
          </div>
          <section className="text-bl grid w-full gap-4 transition-all grid-cols-1 lg:grid-cols-3">
            <Cardcontent className="border-none p-0 col-span-1 md:col-span-2 ">
              <Transaction transactionsData={transactionData} loading={false} userId={user}/>
            </Cardcontent>
            <Cardcontent className="border-none p-0 w-full col-span-1 md:col-span-1">
              <GroupMember loading={false} balance={balance} />
            </Cardcontent>
          </section>
        </div>
      </div>
  )
};