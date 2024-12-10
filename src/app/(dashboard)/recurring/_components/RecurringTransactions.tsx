"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, ChevronDown } from 'lucide-react'
import { RecurringTransaction } from './types'
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

interface RecurringTransactionsProps {
  transactions: RecurringTransaction[]
  onEdit: (transaction: RecurringTransaction) => void
  onDelete: (id: string) => void
}

type ColumnVisibility = {
  amount: boolean
  category: boolean
  frequency: boolean
  nextOccurrence: boolean
}

export const RecurringTransactions: React.FC<RecurringTransactionsProps> = ({
  transactions,
  onEdit,
  onDelete
}) => {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    amount: true,
    category: false,
    frequency: false,
    nextOccurrence: false
  })

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={columnVisibility.amount}
              onCheckedChange={() => toggleColumn('amount')}
            >
              Amount
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.category}
              onCheckedChange={() => toggleColumn('category')}
            >
              Category
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.frequency}
              onCheckedChange={() => toggleColumn('frequency')}
            >
              Frequency
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.nextOccurrence}
              onCheckedChange={() => toggleColumn('nextOccurrence')}
            >
              Next Occurrence
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Title</TableHead>
              {columnVisibility.amount && <TableHead className="sm:hidden">Amount</TableHead>}
              {columnVisibility.category && <TableHead className="sm:hidden">Category</TableHead>}
              {columnVisibility.frequency && <TableHead className="sm:hidden">Frequency</TableHead>}
              {columnVisibility.nextOccurrence && <TableHead className="sm:hidden">Next Occurrence</TableHead>}
              <TableHead className="hidden sm:table-cell">Amount</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Frequency</TableHead>
              <TableHead className="hidden lg:table-cell">Next Occurrence</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.title}</TableCell>
                {columnVisibility.amount && (
                  <TableCell className="sm:hidden">₹{transaction.amount.toFixed(2)}</TableCell>
                )}
                {columnVisibility.category && (
                  <TableCell className="sm:hidden">{transaction.category}</TableCell>
                )}
                {columnVisibility.frequency && (
                  <TableCell className="sm:hidden">{transaction.frequency}</TableCell>
                )}
                {columnVisibility.nextOccurrence && (
                  <TableCell className="sm:hidden">{new Date(transaction.nextOccurrence).toLocaleDateString()}</TableCell>
                )}
                <TableCell className="hidden sm:table-cell">₹{transaction.amount.toFixed(2)}</TableCell>
                <TableCell className="hidden sm:table-cell">{transaction.category}</TableCell>
                <TableCell className="hidden md:table-cell">{transaction.frequency}</TableCell>
                <TableCell className="hidden lg:table-cell">{new Date(transaction.nextOccurrence).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(transaction)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onDelete(transaction.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

