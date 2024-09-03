import {toast} from "sonner";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { bulkdelete } from "@/actions/history/bulkdelete";
import { z } from "zod";
import { bulkdeleteProps } from "@/index";

type catagory = "Income"|"Expance";

export const useBulkDeleteTransaction = () => {
  const queryclient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async(json:z.infer<typeof bulkdeleteProps>) => {
      const responce = await bulkdelete(json);
      if(responce.error)
        toast.error(responce.error);
      else  
        toast.success(responce.success);
      return responce;
    },
    onSuccess : () => {

      queryclient.invalidateQueries({queryKey:["transactions"]});
      
    },
    onError: ()=>{
      // toast.error("Failed to delete transaction's");
    }
  });

  return mutation;
} 