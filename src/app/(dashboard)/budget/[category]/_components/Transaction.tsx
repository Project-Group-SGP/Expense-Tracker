"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePathname } from "next/navigation";
import { SetCategroy_Budget } from "./SetCategory_Budget";
import Card_budget from "./Card_budget";
import { Wallet } from "lucide-react";

type Expense = {
  id: string;
  userId: string;
  category: string;
  amount: string;
  date: string;
  description: string;
};

export type Expenses = Expense[];

const Transaction = ({ data }: { data: { expenses: Expenses; categoryBudget: any } }) => {
  const pathname = usePathname();
  const lastRouteName = pathname?.split("/").pop()?.toUpperCase() || "";

  const categoryTransaction: {
    id: string;
    category: string;
    date: string;
    description: string | null;
    amount: string;
  }[] = [];

  // Filter data category-wise
  const filteredData = data.expenses.filter(
    (transaction) => transaction.category.toUpperCase() === lastRouteName
  );

  filteredData.forEach((transaction) => {
    categoryTransaction.push({
      id: transaction.id,
      category: transaction.category,
      date: transaction.date,
      description: transaction.description || null,
      amount: transaction.amount,
    });
  });

  // Total amount
  const totalAmount = categoryTransaction.reduce((total, transaction) => {
    return total + parseFloat(transaction.amount);
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{lastRouteName}</CardTitle>
        <CardDescription>
          <section className="pb-2 ml-2 pr-2 mt-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Card_budget
              title="Remaining"
              amount={Number(data.categoryBudget[lastRouteName] - totalAmount || 0)}
              color="text-bills"
              icon={Wallet}
            />
            <Card_budget
              title="Expense"
              amount={Number(totalAmount.toFixed(2))}
              color="text-emi"
              icon={Wallet}
            />
            <SetCategroy_Budget category={lastRouteName} currentBudget={Number(data.categoryBudget[lastRouteName] || 0)} />
          </section>
          All {lastRouteName} Transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            A list of your {lastRouteName} transactions.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryTransaction.map((transaction, index) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.description || "-"}</TableCell>
                <TableCell className="text-right">
                  {`₹${parseFloat(transaction.amount).toFixed(2)}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                {`₹${totalAmount.toFixed(2)}`}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Transaction;
