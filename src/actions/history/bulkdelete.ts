import * as  z from "zod";
import { db } from "@/lib/db";
import { bulkdeleteProps } from "@/schemas";
import { currentUserServer } from "@/lib/auth";

export const bulkdelete = async(values:z.infer<typeof  bulkdeleteProps>)=>{
  const user = await currentUserServer();

  if(!user)
    return {error:"unAuthorized!!"};

  const validationeddFields = bulkdeleteProps.safeParse(values)

  if (validationeddFields.error)
    return { error: "Invalid fields!"};

  let Incomeids: string[] = [];
  let Expenseids: string[] = [];

  for (let index = 0; index < values.props.length; index++) {
    if(values.props[index].category==="Income"){
      Incomeids.push(values.props[index].ids);
    }else{
      Expenseids.push(values.props[index].ids);
    }
  }

  try{
    await db.$transaction([
      db.income.deleteMany({
        where:{
          id: {
            in:Incomeids,
          }
        }
      }),
      db.expense.deleteMany({
        where:{
          id: {
            in:Expenseids,
          },
        }
      }),
    ]);

    //TODO:-> Add revalidations here for UI

    return {success:"Successfully Deleted!!"}
  }catch(e){
    console.error("Error deleting transactions:", e)
    return { error:"Failed to delete transactions" }
  }
}