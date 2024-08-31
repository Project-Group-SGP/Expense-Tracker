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
  revalidateTag("totalIncome")
  revalidateTag("getAllData")
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

  const pushPayload = JSON.stringify({
    title: "New Expense Added",
    body: `${category}: ${amount} - ${description}`,
    type: "new-expense",
  })

  const pushPromises = usersPush.map(async (subscription) => {
    try {
      await webPush.sendNotification(
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
            subject: "mailto:etracker690@gmail.com",
            publicKey: process.env.NEXT_PUBLIC_VAPID_KEY as string,
            privateKey: process.env.PRIVATE_VAPID_KEY as string,
          },
        }
      )
      console.log("Push notification sent successfully")
    } catch (error) {
      console.error("Error sending push notification:", error)
      // Consider implementing retry logic or subscription cleanup here
    }
  })

  await Promise.all(pushPromises)

  // console.log("newExpense", newExpense);

  revalidateTag("totalExpense")
  revalidateTag("getAllData")
  return newExpense ? "success" : "error"
}
