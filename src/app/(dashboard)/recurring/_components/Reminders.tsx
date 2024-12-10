"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, ChevronDown } from 'lucide-react'
import { Reminder } from './types'
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

interface RemindersProps {
  reminders: Reminder[]
  onEdit: (reminder: Reminder) => void
  onDelete: (id: string) => void
}

type ColumnVisibility = {
  amount: boolean
  category: boolean
  dueDate: boolean
  status: boolean
}

export const Reminders: React.FC<RemindersProps> = ({
  reminders,
  onEdit,
  onDelete
}) => {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    amount: true,
    category: false,
    dueDate: false,
    status: false
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
              checked={columnVisibility.dueDate}
              onCheckedChange={() => toggleColumn('dueDate')}
            >
              Due Date
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.status}
              onCheckedChange={() => toggleColumn('status')}
            >
              Status
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
              {columnVisibility.dueDate && <TableHead className="sm:table-cell">Due Date</TableHead>}
              {columnVisibility.status && <TableHead className="sm:table-cell">Status</TableHead>}
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead className="hidden lg:table-cell">Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reminders.map((reminder) => (
              <TableRow key={reminder.id}>
                <TableCell className="font-medium">{reminder.title}</TableCell>
                {columnVisibility.amount && (
                  <TableCell className="sm:hidden">₹{reminder.amount.toFixed(2)}</TableCell>
                )}
                {columnVisibility.category && (
                  <TableCell className="sm:hidden">{reminder.category}</TableCell>
                )}
                {columnVisibility.dueDate && (
                  <TableCell className="sm:hidden">{new Date(reminder.dueDate).toLocaleDateString()}</TableCell>
                )}
                {columnVisibility.status && (
                  <TableCell className="sm:hidden">{reminder.status}</TableCell>
                )}
                <TableCell className="hidden sm:table-cell">₹{reminder.amount.toFixed(2)}</TableCell>
                <TableCell className="hidden sm:table-cell">{reminder.category}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(reminder.dueDate).toLocaleDateString()}</TableCell>
                <TableCell className="hidden lg:table-cell">{reminder.status}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(reminder)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onDelete(reminder.id)}>
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

