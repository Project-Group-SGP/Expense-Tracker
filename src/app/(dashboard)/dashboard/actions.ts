"use server"

import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { ExpenseFormData } from "./_components/NewExpense"
import { IncomeFormData } from "./_components/Newincome"
import { revalidateTag } from "next/cache"
import webPush from "web-push"

// add new income
export async function AddnewIncome(data: IncomeFormData) {
  const user = await currentUserServer()
  const { transactionDate, amount, description } = data
  if (!user) {
    throw new Error("Login Please")
  }
  const newIncome = await db.income.create({
    data: { userId: user?.id, amount, date: transactionDate, description },
  })
  revalidateTag("totalIncome");
  revalidateTag("getAllData");
  revalidateTag("getTransactions");
  return newIncome ? "success" : "error"
}

// add new expense
export async function AddnewExpense(data: ExpenseFormData) {
  const user = await currentUserServer()
  const { transactionDate, amount, description, category } = data
  if (!user) {
    throw new Error("Login Please")
  }
  const newExpense = await db.expense.create({
    data: {
      userId: user.id,
      amount,
      date: transactionDate,
      description,
      category,
    },
  })

  const usersPush = await db.pushSubscription.findMany({
    where: {
      userId: user.id,
    },
  })

    //Notification
  const pushPayload = JSON.stringify({
    title: "New Expense Added",
    body: `${category}: $${amount} - ${description}`,
  })

  const pushPromises = usersPush.map((subscription) => {
    return webPush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          auth: subscription.auth,
          p256dh: subscription.p256dh,
        },
      },
      pushPayload,
      {
        vapidDetails: {
          subject: "mailto:1hDkS@example.com",
          publicKey: process.env.NEXT_PUBLIC_VAPID_KEY as string,
          privateKey: process.env.PRIVATE_VAPID_KEY as string,
        },
      }
    )
  })

  await Promise.all(pushPromises)

  // console.log("newExpense", newExpense);

  revalidateTag("totalExpense");
  revalidateTag("getAllData");
  revalidateTag("getTransactions");
  return newExpense ? "success" : "error"
}
