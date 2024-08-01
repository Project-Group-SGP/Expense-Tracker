import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { subDays,parse } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUserServer();
    const searchParams = req.nextUrl.searchParams;
    const to = searchParams.get("to");
    const from = searchParams.get("from");
    const userId = user?.id;
    
    if(!userId)
      return NextResponse.json({ error:"Unauthorized!!"},{status:401});
    
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo,30);

    const startDate = from
    ? parse(from,"yyyy-MM-dd",new Date())
    : defaultFrom;

    const endDate = to
    ? parse(to,"yyyy-MM-dd",new Date())
    : defaultTo;

    if (!userId || typeof userId !== "string") {
      console.log("No user ID provided");
      return NextResponse.json(
        { error: "User ID Not Provided" },
        { status: 400 }
      );
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

    const expense = await db.expense.findMany({
      where: whereClause,
      orderBy:{
        date:"asc"
      }
    });

    const income = await db.income.findMany({
      where: whereClause,
      orderBy:{
        date:"asc"
      }
    });

    return NextResponse.json({ expense,income });
  } catch (error) {
    console.error("Error in GET function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}