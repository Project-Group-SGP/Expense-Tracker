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

export default function DataTable({
  data,
  changeCategory,
}: {
  data: Transaction[]
  changeCategory: (id: number, category: string) => void
}) {
  return (
    <>
      {data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )}
    </>
  )
}
