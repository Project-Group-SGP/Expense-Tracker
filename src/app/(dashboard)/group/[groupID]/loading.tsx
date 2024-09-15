"use client"
import { SettleUp } from "./_components/SettleUp"
import AddExpense from "./_components/AddExpense"
import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Cardcontent } from "../../dashboard/_components/Card"
import { CardContent } from "@/components/ui/card"
import Transaction from "./_components/Transaction"
import { GroupMember } from "./_components/GroupMember"
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
  PaidByName: string
  description: string
  date: string
  status:  "UNSETTLED" | "PARTIALLY_SETTLED" | "SETTLED" | "CANCELLED";
  expenseSplits: ExpenseSplit[]
}
export default function LoadingGroupPage(){

  return (
      <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="mt-20 flex w-full flex-col gap-5 px-4">
        <Skeleton className="h-10 w-[200px]" />
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <p className="flex w-fit">
              <p>Welcome Back,</p>
              <Skeleton className="ml-2 h-8 w-[80px]" />
              <p>👋</p>
            </p>
            <div className="ml-auto flex gap-2">
              <Button
                className="w-full border-red-500 text-red-500 hover:bg-red-700 hover:text-white sm:w-[150px]"
                variant="outline"
              >
                Add an Expense 😤
              </Button>
              <Button
                className="w-full rounded-lg sm:w-[150px] border-green-500 text-green-500 hover:bg-green-700 hover:text-white"
                variant="outline"
              >
                Settle up 🤝
              </Button>
            </div>
          </div>

         <section className="text-bl grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
           <Cardcontent className="border-none p-0 md:col-span-2 lg:col-span-2">
             <Transaction transactionsData={[]} loading={true}/>
          </Cardcontent>
           <Cardcontent className="border-none p-0">
             <GroupMember loading={true} balance={[]}/>
           </Cardcontent>
         </section>
        </div>
      </div>
  )
}