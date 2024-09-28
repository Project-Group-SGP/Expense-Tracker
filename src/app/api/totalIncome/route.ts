import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUserServer()
    // console.log("Current User is ", user)
    // const searchParams = req.nextUrl.searchParams
    // const userId = searchParams.get("userId")
    if (!user || !user.id) {
      return NextResponse.json({ error: "User Not Found" }, { status: 400 })
    }
    // if (!userId) {
    //   console.log("No user ID provided in search params")
    //   return NextResponse.json(
    //     { error: "User ID Not Provided" },
    //     { status: 400 }
    //   )
    // }

    const amount = await db.income.aggregate({
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
