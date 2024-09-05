import {toast} from "sonner";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { bulkdelete } from "@/actions/history/bulkdelete";
import { z } from "zod";
import { bulkdeleteProps } from "@/lib/index";
import { useSearchParams } from "next/navigation";

type catagory = "Income"|"Expance";

export const useBulkDeleteTransaction = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
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
    // Manually invalidate the transactions query after successful deletion
      queryclient.invalidateQueries({ queryKey: ["transactions",from,to] });
      console.log("Deleted successfully");
    },

    onError: ()=>{
      // toast.error("Failed to delete transaction's");
      console.log("Deleted failed");
    }
  });

  return mutation;
} 