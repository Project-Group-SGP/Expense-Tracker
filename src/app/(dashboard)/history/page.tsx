"use client"
import React, { Suspense } from "react"
import { NewExpense } from "./_components/Expance"
import { Newincome } from "./_components/Income"
import PageTitle from "./_components/PageTitle"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useGetTransactions } from "./_hooks/use-get-transactions"
import { useBulkDeleteTransaction } from "./_hooks/use-bulk-delete-transactions"
import DatePicker from "./_components/DatePicker"
import { useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

const HistoryPage = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const queryClient = useQueryClient();

  const transactionsQuery = useGetTransactions();
 
  const transactions = transactionsQuery.data || [];
 
  const deleteTransactions = useBulkDeleteTransaction();

  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

  const handleDelete = async (value: {
    ids: string,
    category: "Income" | "Expense",
  }[]) => {
    console.log("page delete", value);
    
    await deleteTransactions.mutateAsync({ props: value });
    // // Manually invalidate the transactions query after successful deletion
    queryClient.invalidateQueries({ queryKey: ["transactions",from,to] });
  }

  return (
    <>
      <Suspense>
        <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
          <div className="mt-20 flex w-full flex-col gap-5 px-4">
            <PageTitle title="Transaction History" />
            <div className="flex w-full flex-wrap items-center justify-between gap-4"></div>
            <div className="flex justify-between">
              <DatePicker/>
              <div className="ml-auto flex gap-2">
                <Newincome />
                <NewExpense />
              </div>
            </div>
          </div>
          <div className="container mx-auto py-10 px-4">
            <DataTable 
              columns={columns} 
              data={transactions} 
              filterKey="description" 
              onDelete={handleDelete} 
              disabled={isDisabled}
            />
          </div>      
        </div>
      </Suspense>
    </>
  )
}

export default HistoryPage;