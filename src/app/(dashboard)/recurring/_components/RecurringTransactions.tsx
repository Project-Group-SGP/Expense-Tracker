import React from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2 } from 'lucide-react'
import { RecurringTransaction } from './types'

interface RecurringTransactionsProps {
  transactions: RecurringTransaction[]
  onEdit: (transaction: RecurringTransaction) => void
  onDelete: (id: string) => void
}

export const RecurringTransactions: React.FC<RecurringTransactionsProps> = ({
  transactions,
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
            <TableHead className="hidden md:table-cell">Frequency</TableHead>
            <TableHead className="hidden lg:table-cell">Next Occurrence</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.title}</TableCell>
              <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
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
  )
}

