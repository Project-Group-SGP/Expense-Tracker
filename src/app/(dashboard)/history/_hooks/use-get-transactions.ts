import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const query = useQuery({
    queryKey:["transactions",{from,to}],
    queryFn: async () => {  
      const responce = await fetch(`http://localhost:3000/api/history/bulkdata?from=${from}&to=${to}`,{
        cache:"no-cache",
        next:{tags: ["getTransactions"] }
      })

      if(!responce.ok){
        throw new Error("Failed to fetch transactions"); 
      }

      const { data } = await responce.json();

      return data;
    },
  })

  return query;
}