import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import PageTitle from "../../dashboard/_components/PageTitle"
import { Cardcontent } from "../../dashboard/_components/Card"
import { AddExpense } from "./_components/AddExpense"
import { GroupMember } from "./_components/GroupMember"
import { SettleUp } from "./_components/SettleUp"
import Transaction from "./_components/Transaction"

// Define types for the Group and GroupMember
interface Group {
  id: string
  name: string
}

interface GroupMember {
  userId: string
  name: string
  avatar: string
}

export default async function GroupPage({
  params,
}: {
  params: { groupID: string }
}) {
  const user = await currentUserServer()
  if (!user) {
    redirect("/auth/signin")
  }

  const group = await db.group.findUnique({
    where: { id: params.groupID, members: { some: { userId: user.id } } },
  })

  if (!group) {
    redirect("/404")
  }

  // Get group members
  const groupMembers = await db.groupMember.findMany({
    where: { groupId: params.groupID },
  })

  // Get group members' names and avatars
  const groupMemberName: GroupMember[] = await Promise.all(
    groupMembers.map(async (member) => {
      const user = await db.user.findUnique({
        where: { id: member.userId },
        select: { name: true, image: true },
      })
      return {
        userId: member.userId,
        name: user?.name || "Unknown",
        avatar: user?.image || "", // Handle potential null values
      }
    })
  )

  // Get group transactions
  const getPendingPayments = async (userId: string, groupId: string) => {
    const expenses = await db.expenseSplit.findMany({
      where: {
        userId: userId,
        expense: {
          groupId: groupId,
        },
        isPaid: "UNPAID", // Only get unpaid or partially paid expenses
      },
      select: {
        amount: true,
        expense: {
          select: {
            paidBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        payments: {
          select: {
            amount: true,
          },
        },
      },
    })

    // Calculate the total amount the current user needs to pay
    const pendingPayments = expenses.map((expense) => {
      const totalPayments = expense.payments.reduce(
        (acc, payment) => acc + payment.amount.toNumber(),
        0
      )
      const amountToPay = expense.amount.toNumber() - totalPayments

      return {
        member: expense.expense.paidBy.name, // Group member name to whom payment is due
        memberId: expense.expense.paidBy.id, // Group member ID
        amountToPay: amountToPay,
      }
    })

    // Filter only those where the user needs to pay a positive amount
    const filteredPayments = pendingPayments.filter(
      (payment) => payment.amountToPay > 0
    )

    return filteredPayments
  }

  // Usage
  const userId = user.id // Replace with the current user's ID
  const groupId = group.id // Replace with the group ID
  const paymentsDue = await getPendingPayments(userId, groupId)
  console.log("paymentsDue : " + paymentsDue)

  const getUsersToPay = async (userId: string, groupId: string) => {
    const expenseSplits = await db.expenseSplit.findMany({
      where: {
        userId: userId, // Get splits related to the current user
        expense: {
          groupId: groupId, // Within the specified group
        },
        isPaid: { in: ["UNPAID", "PARTIALLY_PAID"] }, // Only unpaid or partially paid expenses
      },
      select: {
        amount: true,
        expense: {
          select: {
            paidBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        payments: {
          select: {
            amount: true,
          },
        },
      },
    })

    // Calculate the amount the current user needs to pay to each user
    const pendingPayments = expenseSplits.map((split) => {
      const totalPayments = split.payments.reduce(
        (acc, payment) => acc + payment.amount.toNumber(),
        0
      )
      const amountToPay = split.amount.toNumber() - totalPayments

      return {
        memberName: split.expense.paidBy.name, // User to whom the payment is due
        memberId: split.expense.paidBy.id, // User ID to whom the payment is due
        amountToPay: amountToPay,
      }
    })

    // Filter out the current user and only include users to whom the amount needs to be paid
    const usersToPay = pendingPayments.filter(
      (payment) => payment.amountToPay > 0 && payment.memberId !== userId
    )

    return usersToPay
  }

  // User need to pay this member
  const usersYouNeedToPay = await getUsersToPay(userId, groupId)
  console.log(usersYouNeedToPay)

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
                groupMemberName={groupMemberName}
                user={user.id}
              />
              <SettleUp
                groupMemberName={groupMemberName}
                usersYouNeedToPay={usersYouNeedToPay}
                user={user.id}
              />
            </div>
          </div>

          <section className="text-bl grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
            {/* Set budget for a particular category */}
            <Cardcontent className="border-none p-0 md:col-span-2 lg:col-span-2">
              {/* Group transaction */}
              <Transaction />
            </Cardcontent>
            <Cardcontent className="border-none p-0">
              {/* Group member balance */}
              <GroupMember groupMemberName={groupMemberName} />
            </Cardcontent>
          </section>
        </div>
      </div>
    </Suspense>
  )
}
