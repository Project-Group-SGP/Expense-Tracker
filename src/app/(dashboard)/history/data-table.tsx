"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import * as React from "react"

import { bulkdelete } from "@/actions/history/bulkdelete"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import DeleteButton from "./_components/Deletebutton"
import { TableSkeleton } from "./_components/TableSkeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterKey: string
  disabled: boolean
}

const bulkdeleteProps = z.object({
  props: z.array(
    z.object({
      ids: z.string(),
      category: z.enum(["Income", "Expense"]),
    })
  ),
  id: z.any(),
})

const deleteTransactions = async (json: z.infer<typeof bulkdeleteProps>) => {
  try {
    const responce = await bulkdelete({ props: json.props })

    if (responce.error !== undefined) {
      toast.error(responce.error, {
        id: json.id,
      })
    } else {
      toast.success(responce.success, {
        id: json.id,
      })
    }
    return responce
  } catch (e) {
    toast.error("Failed to delete transaction's")
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  disabled,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const [disabledi, setdisabled] = React.useState(!!data)

  React.useEffect(() => {
    setdisabled(false)
  }, [data])

  const router = useRouter()

  const onDelete = async (
    value: {
      ids: string
      category: "Income" | "Expense"
    }[]
  ) => {
    // console.log("page delete", value);

    setdisabled(true)

    const loading = toast.loading("Deleting transactions!!")

    await deleteTransactions({ props: value, id: loading })
    setRowSelection({})
    router.refresh()
  }

  const HandleOnclick = async () => {
    const array: {
      ids: string
      category: "Income" | "Expense"
    }[] = table.getFilteredSelectedRowModel().rows.map((arr) => {
      return {
        //@ts-ignore
        ids: arr.original.id,
        //@ts-ignore
        category: arr.original.amount > 0 ? "Income" : "Expense",
      }
    })
    // console.log("array",array);
    await onDelete(array)
  }

  // console.log("sarthak",table.getFilteredSelectedRowModel());

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter ${filterKey}...`}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="mr-2 max-w-sm"
        />
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <DeleteButton
            disabled={disabledi}
            handleOnClick={HandleOnclick}
            selectedCount={table.getFilteredSelectedRowModel().rows.length}
          />
          // <Button size={"sm"} variant={"outline" } className="ml-auto font-normal text-xs" disabled={disabled} onClick={HandleOnclick}>
          // <Trash className="mr-2 size-4"/>  Delete ({table.getFilteredSelectedRowModel().rows.length})
          // </Button>
        )}
        {table.getFilteredSelectedRowModel().rows.length === 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {!disabled ? (
                    "No results."
                  ) : (
                    <div className="flex flex-col gap-4">
                      {[...Array(10)].map((_, index) => (
                        // <Skeleton
                        //   key={index}
                        //   className="mt-2 h-10 w-full bg-gray-200 dark:bg-gray-700"
                        // />
                        <TableSkeleton key={index} />
                      ))}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
