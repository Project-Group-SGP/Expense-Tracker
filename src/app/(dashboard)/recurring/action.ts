"use server"

import { db } from "@/lib/db"
import { RecurringTransaction, Reminder } from "./_components/types"
import { CategoryTypes } from "@prisma/client"

export async function getRecurringTransactions(): Promise<RecurringTransaction[]> {
  try {
    const result = await db.recurringTransaction.findMany()
    return result.map((transaction) => ({
      ...transaction,
      amount: Number(transaction.amount),
      description: transaction.description ?? '',
      category: transaction.category ?? undefined,
      endDate: transaction.endDate ?? undefined,
      customInterval: transaction.customInterval ?? undefined,
      lastProcessed: transaction.lastProcessed ?? undefined,
    }))
  } catch (error) {
    console.error("Error fetching recurring transactions:", error)
    throw new Error("Failed to fetch recurring transactions")
  }
}

export async function getReminders(): Promise<Reminder[]> {
  try {
    const result = await db.reminder.findMany()
    return result.map((reminder) => ({
      ...reminder,
      amount: Number(reminder.amount),
      category: reminder.category ?? undefined,
    }))
  } catch (error) {
    console.error("Error fetching reminders:", error)
    throw new Error("Failed to fetch reminders")
  }
}

export async function addItem(item: Omit<RecurringTransaction | Reminder, "id">) {
  try {
    if ('frequency' in item) {
      return await db.recurringTransaction.create({
        data: {
          ...item,
          category: item.category as CategoryTypes | null,
        },
      })
    } else {
      return await db.reminder.create({
        data: {
          ...item,
          category: item.category as CategoryTypes | null,
        },
      })
    }
  } catch (error) {
    console.error("Error adding item:", error)
    throw new Error("Failed to add item")
  }
}

export async function editItem(item: RecurringTransaction | Reminder) {
  try {
    if ('frequency' in item) {
      return await db.recurringTransaction.update({
        where: { id: item.id },
        data: {
          ...item,
          category: item.category as CategoryTypes | null,
        },
      })
    } else {
      return await db.reminder.update({
        where: { id: item.id },
        data: {
          ...item,
          category: item.category as CategoryTypes | null,
        },
      })
    }
  } catch (error) {
    console.error("Error updating item:", error)
    throw new Error("Failed to update item")
  }
}

export async function deleteItem(id: string) {
  try {
    // Try to delete from both tables, catch and ignore errors if the item doesn't exist in one of them
    await db.recurringTransaction.delete({ where: { id } }).catch(() => {})
    await db.reminder.delete({ where: { id } }).catch(() => {})
  } catch (error) {
    console.error("Error deleting item:", error)
    throw new Error("Failed to delete item")
  }
}

