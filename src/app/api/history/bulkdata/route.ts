import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { parse, subDays } from "date-fns"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUserServer()
    
    const userId = user?.id

    if (!userId || typeof userId !== "string") {
      console.log("No user ID provided")
      return NextResponse.json(
        { error: "User ID Not Provided" },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(req.url)
    const to = searchParams.get("to")
    const from = searchParams.get("from")
    const defaultTo = new Date()
    const defaultFrom = subDays(defaultTo, 30)

    let startDate
    let endDate

    try {
      startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom
      endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo
    } catch (error) {
      console.error("Invalid date format provided. Using defaults.")
      startDate = defaultFrom
      endDate = defaultTo
    }

    let whereClause: any = { userId: userId }

    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    whereClause.date = {
      gte: start,
      lte: end,
    }

    const expensecall = db.expense.findMany({
      where: whereClause,
      orderBy: {
        date: "asc",
      },
    })

    const incomecall = db.income.findMany({
      where: whereClause,
      orderBy: {
        date: "asc",
      },
    })

    const [income, expense] = await Promise.all([incomecall, expensecall])

    const transactions = [
      ...income.map((item) => ({ ...item, category: "Income" })),
      ...expense.map((item) => ({ ...item, amount: -item.amount })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime())

    return NextResponse.json(
      { transactions },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (error) {
    console.error("Error in GET function:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
