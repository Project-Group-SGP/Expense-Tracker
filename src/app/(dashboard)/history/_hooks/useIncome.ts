"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { IncomeFormData } from "../_components/Income" // Adjust import path as necessary
import { AddnewIncome } from "../action" // Adjust import path as necessary

export function useAddIncome() {
  const queryClient = useQueryClient()
  const params = useSearchParams()
  const from = params.get("from") || ""
  const to = params.get("to") || ""

  return useMutation({
    mutationFn: async (data: IncomeFormData) => {
      // console.log("Adding new income:", data);
      const result = await AddnewIncome(data)
      // console.log("AddnewIncome result:", result);
      return result
    },
    onSuccess: () => {
      // console.log("Income added successfully");
      toast.success("Income added successfully", {
        closeButton: true,
        icon: "🤑",
        duration: 4500,
      })

      // console.log("Invalidating queries:", ["transactions", from, to]);
      queryClient.invalidateQueries({ queryKey: ["transactions", from, to] })

      // console.log("Refetching queries:", ["transactions", from, to]);
      queryClient.refetchQueries({ queryKey: ["transactions", from, to] })
    },
    onError: (error) => {
      // console.error("Error adding income:", error);
      toast.error("Failed to add income")
    },
  })
}
