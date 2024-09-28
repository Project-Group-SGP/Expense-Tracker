"use client"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export const useGetTransactions = () => {
  const [isMounted, setIsMounted] = useState(false)
  const params = useSearchParams()
  const from = params.get("from") || ""
  const to = params.get("to") || ""

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return useQuery({
    queryKey: ["transactions", from, to],
    queryFn: async () => {
      // console.log("Fetching transactions with params:", { from, to })
      if (!isMounted) return []
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/history/bulkdata?from=${from}&to=${to}`,
        {
          cache: "no-store",
          method: "GET",
          next: { tags: ["getTransactions"] },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      const { transactions } = await response.json()
      // console.log("Fetched transactions count:", transactions.length)
      return transactions
    },
    enabled: isMounted,
  })
}
