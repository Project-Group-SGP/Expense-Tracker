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
import { useState, useMemo } from "react"
import { EditDescriptionModal } from "./_components/EditDescriptionModal"
import { ArrowUpDown } from "lucide-react"

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
  const [sorting, setSorting] = useState<{
    column: keyof Transaction
    direction: "asc" | "desc"
  } | null>(null)

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

  const sortedData = useMemo(() => {
    if (sorting === null) return data
    return [...data].sort((a, b) => {
      if (sorting.column === "Date") {
        const parseDate = (dateString: string) => {
          const [day, month, year] = dateString.split("-").map(Number)
          return new Date(year, month - 1, day)
        }

        const dateA = parseDate(a.Date)
        const dateB = parseDate(b.Date)

        return sorting.direction === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime()
      }

      if (a[sorting.column] < b[sorting.column])
        return sorting.direction === "asc" ? -1 : 1
      if (a[sorting.column] > b[sorting.column])
        return sorting.direction === "asc" ? 1 : -1
      return 0
    })
  }, [data, sorting])

  const toggleSort = (column: keyof Transaction) => {
    setSorting((current) => {
      if (current?.column === column) {
        return {
          column,
          direction: current.direction === "asc" ? "desc" : "asc",
        }
      }
      return { column, direction: "asc" }
    })
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
        <div className="relative overflow-x-auto">
          <Table className="min-w-96">
            <TableHeader className="sticky top-0 z-10">
              <TableRow>
                <TableHead className="min-w-28">
                  <Button variant="ghost" onClick={() => toggleSort("Date")}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-32">Category</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => toggleSort("Amount")}>
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="pl-9 text-left">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("Description")}
                  >
                    Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="min-w-48 pl-9 text-left">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.Date}</TableCell>
                  <TableCell>
                    <CategoryDropdown
                      initialCategory={transaction.Category}
                      amount={transaction.Amount}
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
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-28">
                <Button variant="ghost">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-32">Category</TableHead>
              <TableHead className="text-right">
                <Button variant="ghost">
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="pl-9 text-left">
                <Button variant="ghost">
                  Description
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="min-w-48 pl-9 text-left">Action</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )}
    </>
  )
}
