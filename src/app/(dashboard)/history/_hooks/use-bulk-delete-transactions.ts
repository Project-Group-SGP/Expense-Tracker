import {toast} from "sonner";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { bulkdelete } from "@/actions/history/bulkdelete";
import { z } from "zod";
import { bulkdeleteProps } from "@/index";

type catagory = "Income"|"Expance";
export const useBulkDeleteTransaction = (props ?: z.infer<typeof bulkdeleteProps>) => {
  const queryclient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async(json:z.infer<typeof bulkdeleteProps>) => {
      const responce = await bulkdelete(json);
      return responce;
    },
    onSuccess : () => {
      toast.success("Transaction's deleted");
      queryclient.invalidateQueries({queryKey:["transaction",{/* id */}]});
      queryclient.invalidateQueries({queryKey:["transactions"]});

      // TODO inVAlidate summary
    },
    onError: ()=>{
      toast.error("Failed to delete transaction's");
    }
  })
} 