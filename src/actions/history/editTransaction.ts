"use server"
import * as  z from "zod";
import { db } from "@/lib/db";
import { editTransactionProps } from "@/lib/index";
import { currentUserServer } from "@/lib/auth";
import { validate } from "uuid";

export const editTransaction = async(values:z.infer<typeof editTransactionProps>)=>{
  const user = await currentUserServer();

  if(!user)
    return {error:"unAuthorized!!"};

  const validationeddFields = editTransactionProps.safeParse(values)

  if (validationeddFields.error)
    return { error: "Invalid fields!"};

  // try{
  //   //  singledeleteProps
  
  // }

  //   return {success:"Successfully updated!!"};
    
  // }catch(e){
  //   console.error("Error updating transaction:", e)
  //   return { error:"Failed to updating transaction"};
  // }
}