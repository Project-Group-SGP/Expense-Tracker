"use server"
import * as  z from "zod";
import { db } from "@/lib/db";
import { singledeleteProps } from "@/lib/index";
import { currentUserServer } from "@/lib/auth";
singledeleteProps
export const deleteSingleTransaction = async(values:z.infer<typeof singledeleteProps>)=>{
  const user = await currentUserServer();

  if(!user)
    return {error:"unAuthorized!!"};

  const validationeddFields = singledeleteProps.safeParse(values)

  if (validationeddFields.error)
    return { error: "Invalid fields!"};

  try{
    if(values.category==="Income"){
      const responce = await db.income.delete({
        where:{
          id:values.id,
        }
      });
    }else{
      const responce = await db.expense.delete({
        where:{
          id:values.id,
        }
      });
    }
    //TODO:-> Add revalidations here for UI

    return {success:"Successfully Deleted!!"};
  }catch(e){
    console.error("Error deleting transaction:", e)
    return { error:"Failed to delete transaction" }
  }
}