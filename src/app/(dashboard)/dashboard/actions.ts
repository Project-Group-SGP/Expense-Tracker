"use server"

import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { ExpenseFormData } from "./_components/NewExpense"
import { IncomeFormData } from "./_components/Newincome"

// get current user
async function getCurrentUser() {
  const user = await currentUserServer()
  if (!user) throw new Error("User not found")
  return user
}

// add new income
export async function AddnewIncome(data: IncomeFormData) {
  const user = await getCurrentUser()
  const { transactionDate, amount, description } = data

  const newIncome = await db.income.create({
    data: { userId: user.id, amount, date: transactionDate, description },
  })

  return newIncome ? "success" : "error"
}

// add new expense
export async function AddnewExpense(data: ExpenseFormData) {
  const user = await getCurrentUser()
  const { transactionDate, amount, description, category } = data

  const newExpense = await db.expense.create({
    data: {
      userId: user.id,
      amount,
      date: transactionDate,
      description,
      category,
    },
  })

  return newExpense ? "success" : "error"
}

// get total income
export async function getTotalIncome() {
  const user = await getCurrentUser()
  const amount = await db.income.aggregate({
    _sum: { amount: true },
    where: { userId: user.id },
  })

  return amount._sum.amount?.toNumber() ?? 0
}

// get total expense
export async function getTotalExpense() {
  const user = await getCurrentUser()
  const amount = await db.expense.aggregate({
    _sum: { amount: true },
    where: { userId: user.id },
  })

  return amount._sum.amount?.toNumber() ?? 0
}

// get monthly spend
const getMonthName = (monthNumber: number): string => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[monthNumber - 1];
};



interface MonthlySummary {
  [key: string]: number;
}

interface AggregationResult {
  date: Date;
  _sum: {
    amount: number | null;
  };
}

const getMonthlyIncomeAndExpenses = async (): Promise<{ incomeByMonth: MonthlySummary, expenseByMonth: MonthlySummary }> => {
  const user = await currentUserServer();

  const incomeAggregation: AggregationResult[] = await db.income.groupBy({
    by: ['date'],
    where: {
      userId: user?.id,
    },
    _sum: {
      amount: true,
    },
  });

  const expenseAggregation: AggregationResult[] = await db.expense.groupBy({
    by: ['date'],
    where: {
      userId: userId,
    },
    _sum: {
      amount: true,
    },
  });

  const incomeByMonth: MonthlySummary = {};
  const expenseByMonth: MonthlySummary = {};

  incomeAggregation.forEach(income => {
    const month = new Date(income.date).getMonth() + 1;
    const monthName = getMonthName(month);
    if (!incomeByMonth[monthName]) {
      incomeByMonth[monthName] = 0;
    }
    incomeByMonth[monthName] += income._sum.amount || 0;
  });

  expenseAggregation.forEach(expense => {
    const month = new Date(expense.date).getMonth() + 1;
    const monthName = getMonthName(month);
    if (!expenseByMonth[monthName]) {
      expenseByMonth[monthName] = 0;
    }
    expenseByMonth[monthName] += expense._sum.amount || 0;
  });

  return { incomeByMonth, expenseByMonth };
};

getMonthlyIncomeAndExpenses()
  .then(data => {
    console.log('Monthly Income:', data.incomeByMonth);
    console.log('Monthly Expenses:', data.expenseByMonth);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(async () => {
    await db.$disconnect();
  });
