import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { Decimal } from "@prisma/client/runtime/library"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // const searchParams = req.nextUrl.searchParams
    // const userId = searchParams.get("userId")

    const user = await currentUserServer()
    if (!user)
      return NextResponse.json({ error: "User Not Found" }, { status: 400 })

    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // if (!userId || typeof userId !== "string") {
    //   console.log("No user ID provided")
    //   return NextResponse.json(
    //     { error: "User ID Not Provided" },
    //     { status: 400 }
    //   )
    // }

    let whereClause: any = { userId: user.id }

    if (startDate && endDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)

      whereClause.date = {
        gte: start,
        lte: end,
      }
    }

    const [expense, income] = await Promise.all([
      db.expense.aggregate({
        _sum: { amount: true },
        where: whereClause,
      }),
      db.income.aggregate({
        _sum: { amount: true },
        where: whereClause,
      }),
    ])

    // if expense or income is null, set it to 0
    expense._sum.amount = expense._sum.amount || new Decimal(0)
    income._sum.amount = income._sum.amount || new Decimal(0)

    const expenseAmount = expense._sum.amount.toNumber()
    const incomeAmount = income._sum.amount.toNumber()

    return NextResponse.json({ expense: expenseAmount, income: incomeAmount })
  } catch (error) {
    console.error("Error in GET function:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
