import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUserServer()
    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get("id")
    const category = searchParams.get("category")
    const userId = user?.id

    if (!userId)
      return NextResponse.json({ error: "Unauthorized!!" }, { status: 401 })

    if (
      !id ||
      typeof id !== "string" ||
      category == null ||
      typeof category !== "string"
    ) {
      console.log("No user ID provided")
      return NextResponse.json(
        { error: "Transaction ID Not Provided" },
        { status: 400 }
      )
    }
    let transaction

    if (category === "Income") {
      transaction = await db.income.findFirst({
        where: {
          id,
        },
      })
    } else {
      transaction = await db.expense.findFirst({
        where: {
          id,
        },
      })
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Error in GET function:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
