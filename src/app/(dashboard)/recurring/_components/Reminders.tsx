import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Edit,
  Trash2,
  ChevronDown,
  Info,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react"
import { Reminder } from "./types"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

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
  onDelete,
}) => {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    amount: true,
    category: true,
    dueDate: true,
    status: true,
    description: true,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility((prev) => ({ ...prev, [column]: !prev[column] }))
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = reminders.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(reminders.length / itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
      case "paid":
        return "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
      case "overdue":
        return "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  return (
    <Card className="w-full shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl font-bold">
          Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm">
              Total: {reminders.length}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(columnVisibility).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={value}
                    onCheckedChange={() =>
                      toggleColumn(key as keyof ColumnVisibility)
                    }
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">Title</TableHead>
                  {columnVisibility.amount && <TableHead>Amount</TableHead>}
                  {columnVisibility.category && <TableHead>Category</TableHead>}
                  {columnVisibility.dueDate && <TableHead>Due Date</TableHead>}
                  {columnVisibility.status && <TableHead>Status</TableHead>}
                  {columnVisibility.description && (
                    <TableHead className="hidden md:table-cell">
                      Description
                    </TableHead>
                  )}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {currentItems.map((reminder) => (
                    <motion.tr
                      key={reminder.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {reminder.title}
                      </TableCell>
                      {columnVisibility.amount && (
                        <TableCell>₹{reminder.amount.toFixed(2)}</TableCell>
                      )}
                      {columnVisibility.category && (
                        <TableCell>{reminder.category}</TableCell>
                      )}
                      {columnVisibility.dueDate && (
                        <TableCell>
                          {new Date(reminder.dueDate).toLocaleDateString()}
                        </TableCell>
                      )}
                      {columnVisibility.status && (
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(reminder.status)} transition-colors duration-200`}
                          >
                            {reminder.status}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.description && (
                        <TableCell className="hidden md:table-cell">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center">
                                  <span className="mr-1">
                                    {truncateText(
                                      reminder.description || "",
                                      20
                                    )}
                                  </span>
                                  {reminder.description &&
                                    reminder.description.length > 20 && (
                                      <Info className="h-4 w-4 text-muted-foreground" />
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
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onEdit(reminder)}
                            className="transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onDelete(reminder.id)}
                            className="transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between bg-muted/10 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="transition-transform duration-200 hover:-translate-x-1"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="transition-transform duration-200 hover:translate-x-1"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
