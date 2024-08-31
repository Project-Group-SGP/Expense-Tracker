// take all requried Data
// 1. total income of this month
// 2. get remaining budget and calculate per day budget
// 3. get all expense of this month
// 4. seprate expense based on category

import { currentUserServer } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUserServer()
    const userId = user?.id

    // console.log("userId:", userId)

    // set startDate and EndDate
    const endDate = new Date()
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth())

    // console.log("userId:", userId, "startDate:", startDate, "endDate:", endDate)

    const income = await db.income.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: userId,
        date: {
          gt: startDate,
          lte: endDate,
        },
      },
    })

    // total income
    const totalIncome = income._sum.amount || 0

    // get budget
    const budget = await db.user.findUnique({
      where: {
        id: userId,
      },
    })

    // total expense
    const totalEx = await db.expense.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: userId,
        date: {
          gt: startDate,
          lte: endDate,
        },
      },
    })

    const totalExpense = totalEx._sum.amount || 0;

    // get all expense data
    const expenses = await db.expense.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    //get category data
    const categoryData = await db.category.findMany({
      where: {
        userId: userId,
      },
    });

    // console.log("categoryData:", categoryData);
    
    // category budget
    const categoryBudget = {
      Other: 0,
      Bills: 0,
      Food: 0,
      Entertainment: 0,
      Transportation: 0,
      EMI: 0,
      Healthcare: 0,
      Education: 0,
      Investment: 0,
      Shopping: 0,
      Fuel: 0,
      Groceries: 0,
    }

    categoryData.forEach((category) => {
      categoryBudget[category.id] = category.budget;
    });

    // category
    const category = {
      Other: 0,
      Bills: 0,
      Food: 0,
      Entertainment: 0,
      Transportation: 0,
      EMI: 0,
      Healthcare: 0,
      Education: 0,
      Investment: 0,
      Shopping: 0,
      Fuel: 0,
      Groceries: 0,
    }

    // TotalExpense
    let TotalExpense = 0;

    // get all category
    expenses.forEach((expense) => {
      category[expense.category] += Number(expense.amount)
      TotalExpense += Number(expense.amount);
    })

    // calculate perday budget
    const remainingBudget = budget?.budget||0 - TotalExpense;

    // Calculate per day budget for the remaining days of the month
    const daysInMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
    const currentDay = endDate.getDate();
    const daysLeft = daysInMonth - currentDay;
    const perDayBudget = remainingBudget||0 / daysLeft ;

    // console.log("perDayBudget : " + perDayBudget);
    

    // remaining budget
    // console.log("totalIncome:", totalIncome)
    // console.log("budget:", budget?.budget)
    // console.log("expenses:", expenses)
    // console.log("category:", category)

    return NextResponse.json({ totalIncome, categoryBudget ,budget, expenses, perDayBudget ,totalExpense ,category })
  } catch (error) {
    console.error("Error in GET function:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
