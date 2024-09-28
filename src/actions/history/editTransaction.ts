"use server"
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { editTransactionProps } from "@/lib/index"
import { revalidateTag } from "next/cache"
import * as z from "zod"

export const editTransaction = async (
  values: z.infer<typeof editTransactionProps>
) => {
  const user = await currentUserServer()

  if (!user) return { error: "unAuthorized!!", success: "" }

  const validationeddFields = editTransactionProps.safeParse(values)

  if (validationeddFields.error)
    return { error: "Invalid fields!", success: "" }

  const transaction = validationeddFields.data.transaction

  console.log("\n\n\nEdit transactions", transaction)

  const find = { id: transaction.id, userId: transaction.userId }
  try {
    if (values.type === "Income") {
      const update = {
        amount: transaction.amount,
        date: transaction.transactionDate,
        description: transaction.describe,
      }
      await db.income.update({
        where: {
          ...find,
        },
        data: {
          ...update,
        },
      })
    } else {
      const update = {
        amount: transaction.amount,
        date: transaction.transactionDate,
        description: transaction.describe,
        category: transaction.category,
      }
      await db.expense.update({
        where: {
          ...find,
        },
        data: {
          ...update,
        },
      })
    }
    revalidateTag("getTransactions")
    return { success: "Successfully updated!!", error: "" }
  } catch (e) {
    console.error("Error updating transaction:", e)
    return { error: "Failed to updating transaction", success: "" }
  }
}
