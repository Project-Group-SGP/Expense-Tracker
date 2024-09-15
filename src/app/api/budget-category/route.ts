import { currentUserServer } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { CategoryTypes } from "@prisma/client"

type CategoryBudget = {
  [key in CategoryTypes]: number;
};

type MonthlyData = {
  month: string;
  totalIncome: number;
  totalExpense: number;
  categoryExpenses: CategoryBudget;
  categoryBudget: CategoryBudget;
  remainingBudget: number;
};

export async function GET(req: NextRequest) {
  try {
    const user = await currentUserServer();
    if (!user?.id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    const userId = user.id;

    const currentYear = new Date().getFullYear();

    const monthlyData: MonthlyData[] = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);

      const income = await db.income.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId: userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const totalIncome = income._sum.amount?.toNumber() || 0;

      const expenses = await db.expense.findMany({
        where: {
          userId: userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          category: true,
          amount: true,
        },
      });

      const totalEx = await db.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId: userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const totalExpense = totalEx._sum.amount?.toNumber() || 0;

      const budget = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          budget: true,
        },
      });

      const categoryData = await db.category.findMany({
        where: {
          userId: userId,
        },
        select: {
          category: true,
          budget: true,
        },
      });

      const categoryBudget: CategoryBudget = Object.values(CategoryTypes).reduce((acc, category) => {
        acc[category] = 0;
        return acc;
      }, {} as CategoryBudget);

      const categoryExpenses: CategoryBudget = Object.values(CategoryTypes).reduce((acc, category) => {
        acc[category] = 0;
        return acc;
      }, {} as CategoryBudget);

      categoryData.forEach((category) => {
        categoryBudget[category.category] = category.budget.toNumber();
      });

      expenses.forEach((expense) => {
        categoryExpenses[expense.category] += expense.amount.toNumber();
      });

      const remainingBudget = (budget?.budget?.toNumber() || 0) - totalExpense;

      monthlyData.push({
        month: startDate.toLocaleString('default', { month: 'long' }),
        totalIncome,
        totalExpense,
        categoryExpenses,
        categoryBudget,
        remainingBudget,
      });
    }

    const budget = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        budget: true,
      },
    });

    // console.log("budget", budget);
    

    return NextResponse.json({ monthlyData, budget });
  } catch (error) {
    console.error("Error in GET function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}