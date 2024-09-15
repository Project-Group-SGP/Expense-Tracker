import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { CategoryTypes } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const user = await currentUserServer();

    if (!user || !user.id) {
        return NextResponse.json({ error: "User Not Found" }, { status: 400 });
    }

    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    if (!category) {
        return NextResponse.json({ error: "Category Not Provided" }, { status: 400 });
    }

    try {
       
        // Fetch the expenses for the category
        const expenses = await db.expense.findMany({
            where: {
                userId: user.id,
                category: category as CategoryTypes,
            },
            select: {
                id: true,
                category: true,
                amount: true,
                date: true,
                description: true,
            },
            orderBy: {
                date: 'asc', // Orders the data by date
            },
        });

        console.log("expenses : ", expenses);
     
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          
          const groupByMonth = (expenses) => {
            return expenses.reduce((acc, expense) => {
              const date = new Date(expense.date);
              const month = monthNames[date.getMonth()]; // Get month name
          
              if (!acc[month]) {
                acc[month] = [];
              }
              acc[month].push(expense);
              
              return acc;
            }, {});
          };
          
          const filteredByMonth = groupByMonth(expenses);
          
        //   console.log( "filteredByMonth : ", filteredByMonth);


        return NextResponse.json({
            filteredByMonth,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
