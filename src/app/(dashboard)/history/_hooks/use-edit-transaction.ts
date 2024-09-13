"use client"
import {toast} from "sonner";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { editTransactionProps } from "@/lib/index";
import { editTransaction } from "@/actions/history/editTransaction";

export const useEditTransaction = (values : z.infer<typeof editTransactionProps>) => {
  const queryclient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async() => {
      const responce = await editTransaction(values);
      return responce;
    },
    onSuccess : () => {
      toast.success("Transaction updated");
      //queryclient.invalidateQueries({queryKey:["transaction",{values.id}]});
      queryclient.invalidateQueries({queryKey:["transactions"]});

    },
    onError: ()=>{
      toast.error("Failed to edit transaction");
    }
  })  
} 