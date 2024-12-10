import React from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from 'lucide-react'
import { Reminder } from './types'

interface RemindersProps {
  reminders: Reminder[]
  onEdit: (reminder: Reminder) => void
  onDelete: (id: string) => void
}

export const Reminders: React.FC<RemindersProps> = ({
  reminders,
  onEdit,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Title</TableHead>
            <TableHead>Amount</TableHead>
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
              <TableCell>₹{reminder.amount.toFixed(2)}</TableCell>
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
  )
}

