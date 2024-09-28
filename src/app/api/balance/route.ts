// import { db } from "@/lib/db"
// import { ExpenseStatus } from "@prisma/client"
// import { NextRequest, NextResponse } from "next/server"

// export async function GET(req: NextRequest) {
//   try {
//     const groupId = req.nextUrl.searchParams.get("groupId") || ""

//     // Fetch all unsettled and partially settled expenses for the group
//     const expenses = await db.groupExpense.findMany({
//       where: {
//         groupId,
//         status: {
//           in: [ExpenseStatus.UNSETTLED, ExpenseStatus.PARTIALLY_SETTLED],
//         },
//       },
//       include: {
//         paidBy: { select: { id: true, name: true } },
//         splits: {
//           where: { isPaid: { in: ["UNPAID", "PAID"] } },
//           select: {
//             isPaid: true,
//             amount: true,
//             user: { select: { id: true, name: true } },
//           },
//         },
//       },
//     })
//     console.log("Expance:", expenses)

//     // Fetch all members of the group
//     const groupMembers = await db.groupMember.findMany({
//       where: { groupId },
//       include: { user: { select: { id: true, name: true, image: true } } },
//     })
//     console.log("GroupMember:", groupMembers)

//     // Initialize balance for each member
//     const balances: { [userID: string]: number } = {}
//     groupMembers.forEach((member) => {
//       balances[member.user.id] = 0
//     })

//     expenses.forEach((expense) => {
//       // Add the full amount to the payer's balance
//       balances[expense.paidBy.id] += Number(expense.amount)
//       console.log("B1: ", balances)

//       // Subtract each unsettled or partially settled split amount from the respective user's balance
//       expense.splits.forEach((split) => {
//         if (split.isPaid === "UNPAID")
//           balances[split.user.id] -= Number(split.amount)
//         else if (split.isPaid === "PAID")
//           balances[expense.paidBy.id] -= Number(split.amount)

//         console.log("B2: ", balances)
//       })
//     })

//     // Prepare the result
//     const result = groupMembers.map((member) => {
//       const balance = balances[member.user.id]
//       return {
//         userId: member.user.id,
//         name: member.user.name,
//         avatar: member.user.image,
//         amount: Math.abs(balance).toFixed(2),
//         status:
//           balance == 0 ? "settled up" : balance > 0 ? "gets back" : "owes",
//         amountColor: balance >= 0 ? "text-green-500" : "text-red-500",
//       }
//     })
//     console.log("Result", result)

//     return NextResponse.json(result)
//   } catch (error) {
//     console.error("Error calculating group balances:", error)
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     )
//   }
// }

import { db } from "@/lib/db"
import { ExpenseStatus } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const groupId = req.nextUrl.searchParams.get("groupId") || ""
    
    // Fetch all unsettled and partially settled expenses for the group
    const expenses = await db.groupExpense.findMany({
      where: {
        groupId,
        status: {
          in: [ExpenseStatus.UNSETTLED, ExpenseStatus.PARTIALLY_SETTLED],
        },
      },
      include: {
        paidBy: { select: { id: true, name: true } },
        splits: {
          where: { isPaid: { in: ["UNPAID", "PAID"] } },
          select: {
            isPaid: true,
            amount: true,
            user: { select: { id: true, name: true } },
          },
        },
      },
    })

    // Fetch all members of the group
    const groupMembers = await db.groupMember.findMany({
      where: { groupId },
      include: { user: { select: { id: true, name: true, image: true } } },
    })

    // Initialize balance for each member
    const balances: { [userID: string]: number } = {}
    const detailedBalances: { [userID: string]: { [otherUserID: string]: number } } = {}

    groupMembers.forEach((member) => {
      balances[member.user.id] = 0
      detailedBalances[member.user.id] = {}
      groupMembers.forEach((otherMember) => {
        if (member.user.id !== otherMember.user.id) {
          detailedBalances[member.user.id][otherMember.user.id] = 0
        }
      })
    })

    expenses.forEach((expense) => {
      // Add the full amount to the payer's balance
      balances[expense.paidBy.id] += Number(expense.amount)

      // Subtract each unsettled or partially settled split amount from the respective user's balance
      expense.splits.forEach((split) => {
        if (split.isPaid === "UNPAID") {
          balances[split.user.id] -= Number(split.amount)
          detailedBalances[split.user.id][expense.paidBy.id] -= Number(split.amount)
          detailedBalances[expense.paidBy.id][split.user.id] += Number(split.amount)
        } else if (split.isPaid === "PAID") {
          balances[expense.paidBy.id] -= Number(split.amount)
        }
      })
    })

    // Prepare the result
    const result = groupMembers.map((member) => {
      const balance = balances[member.user.id]
      const detailedBalance = Object.entries(detailedBalances[member.user.id])
        .filter(([_, amount]) => amount !== 0)
        .map(([userId, amount]) => ({
          userId,
          name: groupMembers.find(m => m.user.id === userId)?.user.name || "",
          amount: Math.abs(amount).toFixed(2),
          status: amount > 0 ? "gets back" : "owes"
        }))

      return {
        userId: member.user.id,
        name: member.user.name,
        avatar: member.user.image,
        amount: Math.abs(balance).toFixed(2),
        status: balance === 0 ? "settled up" : balance > 0 ? "gets back" : "owes",
        amountColor: balance >= 0 ? "text-green-500" : "text-red-500",
        detailedBalance
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error calculating group balances:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}