import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUserServer()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const groupID = req.nextUrl.searchParams.get("groupID")

    console.log(groupID)

    if (!groupID) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      )
    }

    const group = await db.group.findUnique({
      where: { id: groupID },
    })

    if (!group) {
      return new NextResponse("Group not found", { status: 404 })
    }

    // Get users the current user needs to pay
    const expenseSplits = await db.expenseSplit.findMany({
      where: {
        userId: user.id,
        expense: { groupId: group.id },
        isPaid: { in: ["UNPAID", "PARTIALLY_PAID"] },
      },
      select: {
        id: true,
        amount: true,
        expense: {
          select: {
            id: true,
            paidBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        payments: { select: { amount: true } },
      },
    })

    const usersToPay = expenseSplits
      .map((split) => {
        const totalPayments = split.payments.reduce(
          (acc, payment) => acc + payment.amount.toNumber(),
          0
        )
        return {
          id: split.id,
          groupexpanceid: split.expense.id,
          memberName: split.expense.paidBy.name,
          memberId: split.expense.paidBy.id,
          amountToPay: split.amount.toNumber() - totalPayments,
        }
      })
      .filter(
        (payment) => payment.amountToPay > 0 && payment.memberId !== user.id
      )

    // console.log("usersToPay: ", usersToPay);
    // console.log("pendingPayments: ", pendingPayments);

    return NextResponse.json({
      group,
      usersToPay,
    })
  } catch (error) {
    console.error("Error in GET function:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
