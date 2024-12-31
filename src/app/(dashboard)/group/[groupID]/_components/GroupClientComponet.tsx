// GroupClientComponent.tsx (Client Component)
"use client"

import { Cardcontent } from "@/app/(dashboard)/dashboard/_components/Card"
import AddExpense from "./AddExpense"
import PageTitle from "./PageTitle"
import SettleUp from "./SettleUp"

import { GroupMember } from "./GroupMember"
import Transaction from "./Transaction"
import { TransactionSummary } from "../group"

interface GroupClientProps {
  groupName: string
  creatorId: string
  userName: string
  userId: string
  leave: {
    status: "settled up" | "gets back" | "owes"
    amount: number
    userId: string
    groupId: string
  }
  groupMembers: { userId: string; avatar: string; name: string }[]
  settleup: TransactionSummary[]
  transactionData: any[]
  balance: any[]
}

export default function GroupClientComponent({
  groupName,
  creatorId,
  userName,
  userId,
  leave,
  groupMembers,
  settleup,
  transactionData,
  balance,
}: GroupClientProps) {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
      <div className="mt-20 flex w-full flex-col gap-5 px-4">
        <PageTitle title={groupName} leave={leave} createrId={creatorId} />
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <p>
            Welcome Back,
            <span className="text font-semibold text-orange-500 dark:text-sky-500">
              {" "}
              {userName}{" "}
            </span>
            👋
          </p>
          <div className="flex w-full gap-2 sm:ml-auto sm:w-auto">
            <AddExpense
              params={{ groupID: leave.groupId }}
              groupMemberName={groupMembers}
              user={userId}
            />
            <SettleUp
              params={{ groupID: leave.groupId }}
              groupMemberName={groupMembers}
              settleup={settleup}
              user={userId}
            />
          </div>
        </div>
        <section className="text-bl grid w-full grid-cols-1 gap-4 transition-all lg:grid-cols-3">
          <Cardcontent className="col-span-1 border-none p-0 md:col-span-2">
            <Transaction transactionsData={transactionData} loading={false} userId={userId} />
          </Cardcontent>
          <Cardcontent className="col-span-1 w-full border-none p-0 shadow-none md:col-span-1">
            <GroupMember loading={false} balance={balance} />
          </Cardcontent>
        </section>
      </div>
    </div>
  )
}
