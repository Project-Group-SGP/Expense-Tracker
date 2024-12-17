"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, ChevronDown, Info } from 'lucide-react'
import { Reminder } from './types'
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
  description: boolean
}

export const Reminders: React.FC<RemindersProps> = ({
  reminders,
  onEdit,
  onDelete
}) => {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    amount: true,
    category: false,
    dueDate: true,
    status: true,
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
              {columnVisibility.dueDate && <TableHead className="sm:table-cell">Due Date</TableHead>}
              {columnVisibility.status && <TableHead className="sm:table-cell">Status</TableHead>}
              {columnVisibility.description && <TableHead className="hidden md:table-cell">Description</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reminders.map((reminder) => (
              <TableRow key={reminder.id}>
                <TableCell className="font-medium">{reminder.title}</TableCell>
                {columnVisibility.amount && (
                  <TableCell>₹{reminder.amount.toFixed(2)}</TableCell>
                )}
                {columnVisibility.category && (
                  <TableCell>{reminder.category}</TableCell>
                )}
                {columnVisibility.dueDate && (
                  <TableCell>{new Date(reminder.dueDate).toLocaleDateString()}</TableCell>
                )}
                {columnVisibility.status && (
                  <TableCell>{reminder.status}</TableCell>
                )}
                {columnVisibility.description && (
                  <TableCell className="hidden md:table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center">
                            <span className="mr-1">{truncateText(reminder.description || '', 20)}</span>
                            {reminder.description && reminder.description.length > 20 && (
                              <Info className="h-4 w-4" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{reminder.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                )}
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

