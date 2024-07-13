import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Transaction } from "./page"
import { cn } from "@/lib/utils"
import CategoryDropdown from "./_components/CategoryDropDown"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { EditDescriptionModal } from "./_components/EditDescriptionModal"

export default function DataTable({
  data,
  changeCategory,
  deleteTransaction,
  changeDescription,
}: {
  data: Transaction[]
  changeCategory: (id: number, category: string) => void
  deleteTransaction: (index: number) => void
  changeDescription: (id: number, description: string) => void
}) {
  const [openEditDescription, setOpenEditDescription] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleEditDescription = (index: number) => {
    setSelectedIndex(index)
    setOpenEditDescription(true)
  }

  const handleCloseEditModal = () => {
    setOpenEditDescription(false)
    setSelectedIndex(null)
  }

  const onSave = (description: string) => {
    if (selectedIndex !== null) {
      changeDescription(selectedIndex, description)
    }
    handleCloseEditModal()
  }

  return (
    <>
      <EditDescriptionModal
        isOpen={openEditDescription}
        handleCloseModal={handleCloseEditModal}
        date={selectedIndex !== null ? data[selectedIndex].Date : ""}
        amount={selectedIndex !== null ? data[selectedIndex].Amount : 0}
        description={
          selectedIndex !== null ? data[selectedIndex].Description : ""
        }
        onSave={onSave}
      />
      {data.length > 0 ? (
        <Table className="min-w-96">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-28">Date</TableHead>
              <TableHead className="w-32">Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="pl-9 text-left">Description</TableHead>
              <TableHead className="min-w-48 pl-9 text-left">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.Date}</TableCell>
                <TableCell>
                  <CategoryDropdown
                    id={index}
                    changeCategory={changeCategory}
                  />
                </TableCell>
                <TableCell
                  className={cn("text-right", {
                    "text-red-500": transaction.Amount < 0,
                    "text-green-500": transaction.Amount > 0,
                  })}
                >
                  {transaction.Amount > 0 && "+"}
                  {transaction.Amount}
                </TableCell>
                <TableCell className="pl-9 text-left">
                  {transaction.Description.length > 30
                    ? `${transaction.Description.substring(0, 30)}...`
                    : transaction.Description}
                </TableCell>
                <TableCell className="pl-5 text-left">
                  <Button
                    variant="ghost"
                    onClick={() => handleEditDescription(index)}
                  >
                    <span className="text-blue-600">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-right"
                    onClick={() => deleteTransaction(index)}
                  >
                    <span className="text-red-600">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-28">Date</TableHead>
              <TableHead className="w-32">Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="pl-9 text-left">Description</TableHead>
              <TableHead className="min-w-48 pl-9 text-left">Action</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )}
    </>
  )
}
