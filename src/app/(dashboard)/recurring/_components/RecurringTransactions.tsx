"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, ChevronDown, Info } from 'lucide-react'
import { RecurringTransaction } from './types'
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  description: boolean
}

export const RecurringTransactions: React.FC<RecurringTransactionsProps> = ({
  transactions,
  onEdit,
  onDelete
}) => {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    amount: true,
    category: false,
    frequency: true,
    nextOccurrence: true,
    description: true
  })

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({ ...prev, [column]: !prev[column] }))
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
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
            <DropdownMenuCheckboxItem
              checked={columnVisibility.description}
              onCheckedChange={() => toggleColumn('description')}
            >
              Description
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Title</TableHead>
              {columnVisibility.amount && <TableHead className="sm:table-cell">Amount</TableHead>}
              {columnVisibility.category && <TableHead className="sm:table-cell">Category</TableHead>}
              {columnVisibility.frequency && <TableHead className="sm:table-cell">Frequency</TableHead>}
              {columnVisibility.nextOccurrence && <TableHead className="sm:table-cell">Next Occurrence</TableHead>}
              {columnVisibility.description && <TableHead className="hidden md:table-cell">Description</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.title}</TableCell>
                {columnVisibility.amount && (
                  <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                )}
                {columnVisibility.category && (
                  <TableCell>{transaction.category}</TableCell>
                )}
                {columnVisibility.frequency && (
                  <TableCell>{transaction.frequency === "CUSTOM" ? `${transaction.customInterval} days` : transaction.frequency}</TableCell>
                )}
                {columnVisibility.nextOccurrence && (
                  <TableCell>{new Date(transaction.nextOccurrence).toLocaleDateString()}</TableCell>
                )}
                {columnVisibility.description && (
                  <TableCell className="hidden md:table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center">
                            <span className="mr-1">{truncateText(transaction.description || '', 20)}</span>
                            {transaction.description && transaction.description.length > 20 && (
                              <Info className="h-4 w-4" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{transaction.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                )}
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

