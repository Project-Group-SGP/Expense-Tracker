import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUserServer()
    const userId = user?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized!!" }, { status: 401 })
    }

    // get the joinin date for the user
    const userData = await db.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    })

    if (!userData || !userData.emailVerified) {
      return NextResponse.json(
        { error: "Joinin date not found" },
        { status: 404 }
      )
    }

    const joininDate = userData.emailVerified.toISOString().split("T")[0]
    // console.log(joininDate);

    return NextResponse.json({ joininDate })
  } catch (error) {
    console.error("Error in GET function:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
