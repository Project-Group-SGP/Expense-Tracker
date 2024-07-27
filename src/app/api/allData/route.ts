import { db } from "@/lib/db"
import NextAuth from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId || typeof userId !== "string") {
      console.log("No user ID provided")
      return NextResponse.json(
        { error: "User ID Not Provided" },
        { status: 400 }
      )
    }

    const expense = await db.expense.findMany({
      where: { userId: userId },
    });

    return NextResponse.json({expense});
    
  } catch (error) {
    console.error("Error in GET function:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
