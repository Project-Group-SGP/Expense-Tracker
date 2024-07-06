"use client"

import { ColumnDef } from "@tanstack/react-table"

//ToDo add Real Categories
export type Transaction = {
  id: string
  date: string
  category: "Groceries" | "Food" | "Entertainment" | "Other" | null
  amount: number
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
