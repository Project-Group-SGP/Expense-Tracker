import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Cardcontent } from "../../dashboard/_components/Card"
import Transaction from "./_components/Transaction"
import { GroupMember } from "./_components/GroupMember"
import { cn } from "@/lib/utils"
import { LogOut } from "lucide-react"
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
          <div className="flex justify-between"> 
            <Skeleton className="h-10 w-[200px]" />
           <Button
              variant="outline"
              className={cn(
                "w-full sm:w-auto transition-colors duration-300",
                "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
              )}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Group
            </Button>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <p className="flex w-fit">
              Welcome Back,
              <span className="text font-semibold text-orange-500 dark:text-sky-500">
                <Skeleton className="ml-2 h-8 w-[80px]" />
              </span>
              👋
            </p>
            <div className="w-full sm:ml-auto flex gap-2 sm:w-auto">
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
         <section className="text-bl grid w-full gap-4 transition-all grid-cols-1 lg:grid-cols-3">
            <Cardcontent className="border-none p-0 col-span-1 md:col-span-2 ">
             <Transaction transactionsData={[]} loading={true} userId={""}/>
            </Cardcontent>
            <Cardcontent className="border-none p-0 w-full col-span-1 md:col-span-1">
             <GroupMember loading={true} balance={[]}/>
            </Cardcontent>
          </section>
        </div>
      </div>
  )
}
