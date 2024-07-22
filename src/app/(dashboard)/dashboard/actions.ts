"use server"

import { db } from "@/lib/db"
import { IncomeFormData } from "./_components/Newincome"
import { currentUserServer } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function AddnewIncome(data: IncomeFormData) {
  console.log("into add new income")
  // Check data is valid with zod
  const user = await currentUserServer()
  if (!user) {
    throw new Error("User not found")
  }

  const { transactionDate, amount, description } = data
  const newIncome = await db.income.create({
        data: {
          userId: user.id,
          amount,
          date: transactionDate,
          description,
        }
      });
      if(newIncome){
        revalidatePath("/")
        return "success";
      }else{
        return "error";
      }
}
