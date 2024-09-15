import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const columns = [
  { id: 'date', label: 'Date', sortable: true },
  { id: 'description', label: 'Description', sortable: false },
  { id: 'category', label: 'Category', sortable: true },
  { id: 'paidBy', label: 'Paid By', sortable: true },
  { id: 'amount', label: 'Amount', sortable: true },
  { id: 'status', label: 'Status', sortable: false },
  { id: 'action', label: 'View split', sortable: false },
];

const SkeletonRow = () => (
  <TableRow>
    {columns.map((column) => (
      <TableCell key={column.id}>
        <Skeleton className="h-8 rounded"></Skeleton>
      </TableCell>
    ))}
  </TableRow>
);

export default function TransactionTableSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Transactions</CardTitle>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Switch id="detailed-view" />
            <label htmlFor="detailed-view" className="text-sm font-medium text-muted-foreground">
              Show Cleared Transactions
            </label>
          </div>
          <Button
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-colors duration-200"
          >
            Simple View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.id} className={column.id === 'amount' ? 'text-right' : ''}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      className={`flex items-center ${column.id === 'amount' ? 'justify-end w-full' : ''}`}
                    >
                      {column.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Page 1 of 1</span>
            <Skeleton className="w-[70px] h-8 rounded"></Skeleton>
          </div>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}