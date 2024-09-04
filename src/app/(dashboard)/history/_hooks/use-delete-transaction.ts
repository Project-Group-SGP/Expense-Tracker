import {toast} from "sonner";
import { QueryClient, useMutation,useQueryClient } from "@tanstack/react-query";
import { deleteSingleTransaction } from "@/actions/history/deleteTransaction";
import { z } from "zod";
import { singledeleteProps } from "@/lib/index";

export const useDeleteTransaction = (values:z.infer<typeof singledeleteProps>) => {
  const queryclient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async() => {
      const responce = await deleteSingleTransaction(values);
      return responce;
    },
    onSuccess : () => {
      toast.success("Transaction deleted");
      //queryclient.invalidateQueries({queryKey:["transaction",{values.id}]});
      queryclient.invalidateQueries({queryKey:["transactions"]});
    },
    onError: ()=>{
      toast.error("Failed to delete transaction");
    }
  })
  return mutation;
} 