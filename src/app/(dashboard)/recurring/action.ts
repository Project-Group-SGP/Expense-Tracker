"use server"

import { db } from "@/lib/db"
import { RecurringTransaction, Reminder 

} from "./_components/types"
import { CategoryTypes, ReminderStatus } from "@prisma/client"
import { number } from "zod"
import { RecurringFrequency } from "@prisma/client"
import { log } from "util"
import { currentUserServer } from "@/lib/auth"

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
    
    const user = await currentUserServer()

    if (!user) {
      throw new Error("User is not authenticated");
    }

    if ('frequency' in item) {
      console.log("Try to Adding reccurrent");
      
      const recurringTransaction = await db.recurringTransaction.create({
        data: {
          userId: user.id,
          description: item.description ?? '',
          amount: item.amount,
          category: item.category as CategoryTypes | null,
          type: item.type,
          frequency:item.frequency as RecurringFrequency,
          customInterval: 'customInterval' in item ? Number(item.customInterval) ?? null : null,
          startDate: 'startDate' in item ? new Date(item.startDate as string | number) : new Date(),
          endDate: 'endDate' in item ? new Date(item.endDate as string | number) : null,
          lastProcessed: 'lastProcessed' in item ? new Date(item.lastProcessed as string | number | Date) : null,
          nextOccurrence: 'nextOccurrence' in item ? new Date(item.nextOccurrence as string | number | Date) : new Date(),
          reminderEnabled: 'reminderEnabled' in item ? item.reminderEnabled as boolean : false,
          // isActive: 'isActive' in item ? item.isActive as boolean : false,
        },
      });
      console.log(recurringTransaction);
      
      console.log("Reccurrent Added Successfully");
      
    } else {
      console.log("Try to Adding reminder");
      
      const reminder = await db.reminder.create({
        data: {
          userId: user.id,
          description: item.description ?? '',
          amount: item.amount,
          category: item.category as CategoryTypes | null,
          type: item.type,
          dueDate: 'dueDate' in item ? new Date(item.dueDate as string | number | Date) : new Date(),
          status: 'status' in item ? item.status as ReminderStatus : "PENDING",
        },
      });
      console.log(reminder);

      console.log("Reminder Added Successfully");
      
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

