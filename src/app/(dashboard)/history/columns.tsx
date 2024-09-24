"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { CategoryTypes } from "@prisma/client"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { EditTransaction } from "./_components/EditTransactions"
export type ResponceType = {
  category: CategoryTypes | 'Income';
  id : string;
  userId : string;
  amount: number;
  date: Date;
  description: string | null;
};

export const columns: ColumnDef<ResponceType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row}) => {
      const date = row.getValue("date") as Date;
      return (
        <div>
          <span className="hidden sm:block">  
            {format(date,"dd MMMM, yyyy")}
          </span>
          <span className="sm:hidden block">  
            {date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row}) => {
      const amount = parseFloat(row.getValue("amount"));

      return (
        <Badge
          variant={amount<0 ? "destructive" : "primary"}
          className="text-xs font-medium px-3.5 py-2.5 rounded-2xl"
        >
          {amount<0 ? formatCurrency(amount).slice(1) : formatCurrency(amount)}
        </Badge>
      )
    }
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row}) => {
      return (
        <span>
          {row.original.category}
        </span>
      )
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell:({row}) => {
      if(row.original.description === null)
        return <></>
      
      return (
        <span>
          {row.original.description.length>20?row.original.description?.slice(0,19)+"..." :row.original.description}
        </span>
      )
    }
  },
  {
    id: "Edit",
    accessorKey: "Edit",
    header: "Edit",
    cell: ({ row }) => {
      const transaction = row.original;
      const isIncome = transaction.category === "Income";
      const amount = isIncome ? transaction.amount : -1 * transaction.amount;
     
      return (
        <EditTransaction
          transaction={{...transaction, amount}}
          type={isIncome ? "Income" : "Expense"}
        />
      );
    },
  },
]
