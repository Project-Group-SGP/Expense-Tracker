"use server"
import { currentUserServer } from "@/lib/auth"
import { format, parseISO } from "date-fns"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import HistoryPage from "./_components/History_page"

const getTransactionData = cache(
  async (cookie: string, from: string, to: string) => {
    try {
      const res = await fetch(
        `${process.env.BASE_URL}/api/history/bulkdata?from=${from}&to=${to}`,
        {
          method: "GET",
          headers: { Cookie: cookie },
          next: { tags: ["getTransactions"] },
          cache: "force-cache",
        }
      )

      if (!res.ok) throw new Error("Failed to fetch all transaction data")

      const { transactions } = await res.json()
      // console.log("Fetched transactions count:", transactions.length)
      return transactions
    } catch (error) {
      // console.error("Error fetching transaction data:", error)
      return []
    }
  }
)

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) => {
  const headersList = headers()
  const cookie = headersList.get("cookie") || ""
  const user = await currentUserServer()

  const from = searchParams?.from || ""
  const to = searchParams?.to || ""

  if (from === "" && to === "") {
    if (user && user.joininDate) {
      const joininDate = parseISO(user.joininDate)
      const formattedStartDate = format(joininDate, "yyyy-MM-dd")
      const formattedEndDate = format(new Date(), "yyyy-MM-dd")
      // router.push(`?from=${formattedStartDate}&to=${formattedEndDate}`, {
      //   scroll: false,
      // })
      redirect(`?from=${formattedStartDate}&to=${formattedEndDate}`)
    } else {
      return <div>Please log in to view your Transaction History.</div>
    }
  }

  const [Data] = await Promise.all([getTransactionData(cookie, from, to)])

  return <HistoryPage Data={Data} />
}

export default Page

// "use client"
// import React from "react"
// import PageTitle from "./_components/PageTitle"
// import { columns } from "./columns"
// import { DataTable } from "./data-table"
// import { useGetTransactions } from "./_hooks/use-get-transactions"
// import { useBulkDeleteTransaction } from "./_hooks/use-bulk-delete-transactions"
// import { useAddIncome } from "./_hooks/useIncome"
// import { useAddExpense } from "./_hooks/useExpance"
// import { useEditTransaction } from "./_hooks/use-edit-transaction" // Import the edit hook
// import DatePicker from "./_components/DatePicker"
// import { useQueryClient } from "@tanstack/react-query"
// import { useSearchParams } from "next/navigation"
// import dynamic from 'next/dynamic';

// const NewExpense = dynamic(() => import('./_components/Expance').then((mod) => mod.NewExpense), {
//   ssr: false,
// });

// const Newincome = dynamic(() => import('./_components/Income').then((mod) => mod.Newincome), {
//   ssr: false,
// });
// const HistoryPage = () => {
//   const params = useSearchParams();
//   const from = params.get("from") || "";
//   const to = params.get("to") || "";

//   const queryClient = useQueryClient();

//   const transactionsQuery = useGetTransactions();
//   const transactions = transactionsQuery.data || [];

//   const deleteTransactions = useBulkDeleteTransaction();
//   const addIncomeMutation = useAddIncome();
//   const addExpenseMutation = useAddExpense();
//   // const editTransactionMutation = useEditTransaction(); // Initialize the edit hook

//   const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending || addIncomeMutation.isPending || addExpenseMutation.isPending ;
//   console.log(isDisabled," ",addIncomeMutation.isPending," ",addExpenseMutation.isPending);
//   // || editTransactionMutation.isPending;

//   const handleDelete = async (value: {
//     ids: string,
//     category: "Income" | "Expense",
//   }[]) => {
//     console.log("page delete", value);
//     await deleteTransactions.mutateAsync({ props: value });
//     queryClient.invalidateQueries({ queryKey: ["transactions", from, to] });
//   }

//   const handleAddIncome = async (data: any) => {
//     await addIncomeMutation.mutateAsync(data);
//     queryClient.invalidateQueries({ queryKey: ["transactions", from, to] });
//   }

//   const handleAddExpense = async (data: any) => {
//     await addExpenseMutation.mutateAsync(data);
//     queryClient.invalidateQueries({ queryKey: ["transactions", from, to] });
//   }

//   // const handleEditTransaction = async (data: any) => {
//   //   await editTransactionMutation.mutateAsync(data);
//   //   queryClient.invalidateQueries({ queryKey: ["transactions", from, to] });
//   // }

//   return (
//     <>
//       <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
//         <div className="mt-20 flex w-full flex-col gap-5 px-4">
//           <PageTitle title="Transaction History" />
//           <div className="flex w-full flex-wrap items-center justify-between gap-4"></div>
//           <div className="flex justify-between">
//             <DatePicker />
//             <div className="ml-auto flex gap-2">
//               <Newincome onAdd={handleAddIncome} />  {/* Pass the handler to the component */}
//               <NewExpense onAdd={handleAddExpense} /> {/* Pass the handler to the component */}
//             </div>
//           </div>
//         </div>
//         <div className="container mx-auto py-10 px-4">
//           <DataTable
//             columns={columns}
//             data={transactions}
//             filterKey="description"
//             onDelete={handleDelete}
//             // onEdit={handleEditTransaction}  {/* Handle editing transactions if applicable */}
//             disabled={isDisabled}
//           />
//         </div>
//       </div>
//     </>
//   )
// }

// export default HistoryPage;
