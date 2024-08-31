import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const query = useQuery({
    //Todo check i params are needed in key
    queryKey:["transactions"],
    queryFn: async () => {  
      const responce = await fetch(`http://localhost:3000/api/history/bulkdata?from=${from}&to=${to}`,{
        // TODO:Don't invalidate cache use invaidate tag
        cache:"no-cache",
        next:{tags: ["getTransactions"] }
      });

      if(!responce.ok){
        throw new Error("Failed to fetch transactions"); 
      }
      
      const {transactions} = await responce.json();

      return transactions;
    },
  });

  return query;
}