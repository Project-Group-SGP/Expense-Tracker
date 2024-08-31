import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { Sql } from "@prisma/client/runtime/library";
import { subDays,parse } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUserServer();
    const searchParams = req.nextUrl.searchParams;
    const to = searchParams.get("to");
    const from = searchParams.get("from");
    const userId = user?.id;
    
    if (!userId || typeof userId !== "string") {
      console.log("No user ID provided");
      return NextResponse.json(
        { error: "User ID Not Provided" },
        { status: 400 }
      );
    }
    
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo,30);

   
    let startDate;
    let endDate;

    try {
      startDate = from ? parse(from, "yyyy-MM-dd",new Date()) : defaultFrom;
      endDate = to ? parse(to, "yyyy-MM-dd",new Date()) : defaultTo;
    } catch (error) {
      console.error("Invalid date format provided. Using defaults.");
      startDate = defaultFrom;
      endDate = defaultTo;
    }

    let whereClause: any = { userId: userId };

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    whereClause.date = {
      gte: start,
      lte: end,
    };

    const expensecall = db.expense.findMany({
      where: whereClause,
      orderBy:{
        date:"asc"
      }
    });

    const incomecall = db.income.findMany({
      where: whereClause,
      orderBy:{
        date:"asc"
      }
    });

    const [income,expense]= await db.$transaction([incomecall,expensecall]);

    const transactions = [
      ...income.map(item => ({ ...item, category: 'Income' })),
      ...expense.map(item => ({ ...item, amount: -item.amount }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    // const transactions = await db.$queryRaw<{ category: string; id: string; userId: string; amount: number; date: Date; description: string | null }[]>(`
    //   SELECT * FROM income
    //   WHERE userId = ? AND date BETWEEN ? AND ?
    //   UNION ALL
    //   SELECT * FROM expense
    //   WHERE userId = ? AND date BETWEEN ? AND ?
    //   ORDER BY date ASC
    // `, userId, start, end, userId, start, end);

    // const transactions = await db.$queryRaw`
    //   SELECT *, 'Income' AS category FROM Income
    //   WHERE userId = ${"userId"} AND date BETWEEN ${"startDate"} AND ${"endDate"}
    //   UNION ALL
    //   SELECT *, -amount AS amount FROM Expense
    //   WHERE userId = ${"userId"} AND date BETWEEN ${"startDate"} AND ${"endDate"}
    //   ORDER BY date ASC
    // `;
    
    return NextResponse.json({transactions});
  } catch (error) {
    console.error("Error in GET function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}