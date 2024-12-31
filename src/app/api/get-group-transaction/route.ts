import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  // check if user is logged in
  const user = await currentUserServer()
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // check if group id is provided
  const groupID = req.nextUrl.searchParams.get("groupID")
  if (!groupID) {
    return new NextResponse("Group ID is required", { status: 400 })
  }

  // check if group exists
  const group = await db.group.findUnique({
    where: { id: groupID },
  })

  if (!group) {
    return new NextResponse("Group not found", { status: 404 })
  }

  // get group members
  const groupMembers = await db.groupMember.findMany({
    where: { groupId: group.id },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  })

  // console.log("groupMembers : ", groupMembers);

  // chek if current user is in group
  const groupMember = groupMembers.find((member) => member.userId === user.id)

  if (!groupMembers) {
    return new NextResponse("Group members not found", { status: 404 })
  }

  // console.log("GroupID", group.id)

  // get group transactions
  const groupTransations = await db.groupExpense.findMany({
    where: { groupId: group.id },
    select: {
      id: true,
      status: true,
      amount: true,
      category: true,
      description: true,
      date: true,
      paidBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      splits: {
        select: {
          id: true,
          amount: true,
          isPaid: true,
          expenseId: true,
          userId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payments: true,
        },
      },
      group: true,
    },
    orderBy: {
      date: "desc",
    },
  })
  // console.log("groupTransations : ", groupTransations)
  // console.log("group : ", group);

  // format data According to required
  const formattedData = groupTransations.map((expense) => ({
    groupId: expense.group.id,
    expenseId: expense.id,
    amount: expense.amount,
    category: expense.category,
    paidById: expense.paidBy.id,
    PaidByName: expense.paidBy.name,
    description: expense.description,
    status: expense.status,
    date: expense.date,
    expenseSplits: expense.splits.map((split) => {
      // Find the matching group member by userId
      const member = groupMembers.find(
        (member) => member.userId === split.userId
      )
      return {
        userName: member ? member.user.name : "Unknown", // Use 'Unknown' if the member is not found
        expenseId: split.expenseId,
        amount: split.amount,
        isPaid: split.isPaid,
      }
    }),
  }))

  // console.log("formattedData: ", JSON.stringify(formattedData, null, 2))

  return NextResponse.json(formattedData)
}
