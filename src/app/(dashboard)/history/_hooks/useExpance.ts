"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { ExpenseFormData } from "../_components/Expance" // Adjust import path as necessary
import { AddnewExpense } from "../action" // Adjust import path as necessary
export function useAddExpense() {
  const queryClient = useQueryClient()
  const params = useSearchParams()
  const from = params.get("from") || ""
  const to = params.get("to") || ""

  return useMutation({
    mutationFn: (data: ExpenseFormData) => AddnewExpense(data),
    onSuccess: () => {
      toast.success("Expense added successfully", {
        closeButton: true,
        icon: "💸",
        duration: 4500,
      })
      // Invalidate and refetch
      // console.log("Invalidating queries:", ["transactions", from, to]);
      queryClient.invalidateQueries({ queryKey: ["transactions", from, to] })

      // console.log("Refetching queries:", ["transactions", from, to]);
      queryClient.refetchQueries({ queryKey: ["transactions", from, to] })
    },
    onError: (error) => {
      // console.error("Error adding expense:", error)
      toast.error("Failed to add expense")
    },
  })
}
