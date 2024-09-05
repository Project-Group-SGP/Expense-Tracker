import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // const searchParams = req.nextUrl.searchParams
    // const userId = searchParams.get("userId")

    const user = await currentUserServer()
    if (!user)
      return NextResponse.json({ error: "User Not Found" }, { status: 400 })

    // if (!userId || typeof userId !== "string") {
    //   console.log("No user ID provided")
    //   return NextResponse.json(
    //     { error: "User ID Not Provided" },
    //     { status: 400 }
    //   )
    // }

    const amount = await db.expense.aggregate({
      _sum: { amount: true },
      where: { userId: user.id },
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
