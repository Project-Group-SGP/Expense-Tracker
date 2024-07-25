import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get("userId")
    if (!userId) {
      console.log("No user ID provided in search params")
      return NextResponse.json(
        { error: "User ID Not Provided" },
        { status: 400 }
      )
    }

    const amount = await db.income.aggregate({
      _sum: { amount: true },
      where: { userId: userId },
    })

    return NextResponse.json(amount._sum.amount?.toNumber() ?? 0)
  } catch (error) {
    console.error("Error in GET function:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
