import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  return useQuery({
    queryKey: ["transactions", from, to],
    // queryKey: ["transactions"],
    queryFn: async () => {  
      const response = await fetch(`http://localhost:3000/api/history/bulkdata?from=${from}&to=${to}`, {
        cache: "no-store",
        method: "GET",
        next: { tags: ["getTransactions"] }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions"); 
      }
      
      const { transactions } = await response.json();
      return transactions;
    },
  });
}