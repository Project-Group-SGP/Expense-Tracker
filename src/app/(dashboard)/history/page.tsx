"use client"
import React, { Suspense, useCallback, useEffect, useState } from "react"
import { NewExpense } from "../dashboard/_components/NewExpense"
import { Newincome } from "../dashboard/_components/Newincome"
import PageTitle from "../dashboard/_components/PageTitle"
import { columns, ResponceType } from "./columns"
import { DataTable } from "./data-table"
import { useGetTransactions } from "./_hooks/use-get-transactions"
import { useBulkDeleteTransaction } from "./_hooks/use-bulk-delete-transactions"
import DatePicker from "./_components/DatePicker"
import { useQueryClient } from "@tanstack/react-query"

const HistoryPage =  () => {
  const queryclient = useQueryClient();

  const transactionsQuery = useGetTransactions();
  
  const transactions = transactionsQuery.data || [];
  
  const deleteTransactions = useBulkDeleteTransaction();

  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

  const HandleDelete = (value:{
        ids: string,
        category: "Income" | "Expense",
      }[]) => {

      console.log("page delete",value);
      
      deleteTransactions.mutate({props:value});
      queryclient.invalidateQueries({queryKey:["transactions"]});
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
          <DataTable columns={columns} data={transactions} filterKey="description" onDelete={HandleDelete} disabled={isDisabled}/>
        </div>      
      </div>
  </Suspense>
    </>
  )
}

export default HistoryPage;