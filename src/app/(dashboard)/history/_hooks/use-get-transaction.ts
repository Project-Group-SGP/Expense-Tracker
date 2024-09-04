import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import * as z from "zod";

type categoryprop = "Income"| "Expense";
export const useGetTransaction = (id:string,category:categoryprop) => {
  const query = useQuery({
    enabled:!!id,
    queryKey:["transactions",{id}],
    queryFn: async () => {  
      const responce = await fetch(`${process.env.BASE_URL}/api/history/singletransaction?id=${id}&category=${category}`,{
        cache:"no-cache",
        next:{tags: ["getTransaction"] }
      })

      if(!responce.ok){
        throw new Error("Failed to fetch transaction"); 
      }

      const { data } = await responce.json();

      return data;
    },
  })

  return query;
}