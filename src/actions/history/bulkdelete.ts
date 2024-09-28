"use server"
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { bulkdeleteProps } from "@/lib/index"
import * as z from "zod"

export const bulkdelete = async (values: z.infer<typeof bulkdeleteProps>) => {
  // console.log("\n\n\n\ndeleteProps",values);

  const user = await currentUserServer()
  if (!user) return { error: "unAuthorized!!" }

  const validationeddFields = bulkdeleteProps.safeParse(values)

  if (validationeddFields.error) return { error: "Invalid fields!" }

  let Incomeids: string[] = []
  let Expenseids: string[] = []

  for (let index = 0; index < values.props.length; index++) {
    if (values.props[index].category === "Income") {
      Incomeids.push(values.props[index].ids)
    } else {
      Expenseids.push(values.props[index].ids)
    }
  }

  try {
    await Promise.all([
      db.income.deleteMany({
        where: {
          id: {
            in: Incomeids,
          },
        },
      }),
      db.expense.deleteMany({
        where: {
          id: {
            in: Expenseids,
          },
        },
      }),
    ])
    // revalidateTag("getTransactions");
    // console.log("\n\n\n\n YAA")
    return { success: "Successfully Deleted!!" }
  } catch (e) {
    console.error("Error deleting transactions:", e)
    return { error: "Failed to delete transactions" }
  }
}
