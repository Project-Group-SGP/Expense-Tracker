import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    // const userId = searchParams.get("userId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const user = await currentUserServer()

    if (!user || !user.id) {
      return NextResponse.json({ error: "User Not Found" }, { status: 400 })
    }

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
      db.expense.findMany({
        where: whereClause,
      }),
      db.income.findMany({
        where: whereClause,
      }),
    ])

    // console.log(whereClause)

    // console.log("Income data");
    // console.log(income);
    // console.log("Expense data");
    // console.log(expense);

    return NextResponse.json({ expense, income })
  } catch (error) {
    console.error("Error in GET function:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const searchParams = req.nextUrl.searchParams;
//     const userId = searchParams.get("userId");
//     const startDate = searchParams.get("startDate");
//     const endDate = searchParams.get("endDate");

//     if (!userId || typeof userId !== "string") {
//       console.log("No user ID provided");
//       return NextResponse.json(
//         { error: "User ID Not Provided" },
//         { status: 400 }
//       );
//     }

//     let whereClause: any = { userId: userId };

//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);

//       whereClause.date = {
//         gte: start,
//         lte: end,
//       };
//     }

//     const expense = await db.expense.findMany({
//       where: whereClause,
//     });

//     console.log(whereClause);

//     return NextResponse.json({ expense });
//   } catch (error) {
//     console.error("Error in GET function:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
