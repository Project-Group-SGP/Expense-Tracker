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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Next Occurrence</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.title}</TableCell>
            <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell>{transaction.frequency}</TableCell>
            <TableCell>{new Date(transaction.nextOccurrence).toLocaleDateString()}</TableCell>
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
  )
}

