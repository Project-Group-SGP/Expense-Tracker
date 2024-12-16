"use server"

import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { CategoryTypes } from "@prisma/client"
import nodemailer from "nodemailer"


// Email transporter configuration
const sendTransactionEmail = async (email: string, type: string, data: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  // HTML email template for both reminders and recurring transactions
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: type === 'reminder' 
      ? "Spendwise Reminder Notification" 
      : "Recurring Transaction Processed",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${type === 'reminder' ? 'Reminder Notification' : 'Transaction Processed'}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            padding: 20px; 
            background-color: #f4f4f4; 
        }
        .header { 
            background-color: #2E7D32; 
            color: white; 
            padding: 10px; 
            text-align: center; 
        }
        .content { 
            background-color: white; 
            padding: 20px; 
            margin-top: 10px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Spendwise ${type === 'reminder' ? 'Reminder' : 'Transaction'} Notification</h2>
        </div>
        <div class="content">
            <h3>${data.title}</h3>
            <p><strong>Amount:</strong> $${data.amount.toFixed(2)}</p>
            ${type === 'reminder' 
              ? `<p><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</p>`
              : `<p><strong>Next Occurrence:</strong> ${new Date(data.nextOccurrence).toLocaleDateString()}</p>`
            }
            <p>${type === 'reminder' 
              ? 'Please take action on this reminder.' 
              : 'Your recurring transaction has been processed successfully.'
            }</p>
        </div>
    </div>
</body>
</html>`,
  }

  try {
    console.log(`Attempting to send ${type} email...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`${type} email sent successfully:`, info.response);
    return info;
  } catch (error) {
    console.error(`Error sending ${type} email:`, error);
    throw error;
  }
}

// Utility function to calculate next occurrence
function calculateNextOccurrence(transaction: any): Date {
  const lastOccurrence = new Date(transaction.nextOccurrence)
  
  switch (transaction.frequency) {
    case 'DAILY':
      return new Date(lastOccurrence.setDate(lastOccurrence.getDate() + 1))
    
    case 'WEEKLY':
      return new Date(lastOccurrence.setDate(lastOccurrence.getDate() + 7))
    
    case 'MONTHLY':
      return new Date(lastOccurrence.setMonth(lastOccurrence.getMonth() + 1))
    
    case 'YEARLY':
      return new Date(lastOccurrence.setFullYear(lastOccurrence.getFullYear() + 1))
    
    case 'CUSTOM':
      return new Date(lastOccurrence.setDate(
        lastOccurrence.getDate() + (transaction.customInterval || 1)
      ))
    
    default:
      throw new Error('Invalid recurring frequency')
  }
}

// Main server action for processing reminders
export const ProcessReminders = async () => {
  // Verify current user
  const user = await currentUserServer()
  if (!user) return { error: "Unauthorized" }

  try {
    const now = new Date()

    // Process Pending Reminders
    const reminders = await db.reminder.findMany({
      where: {
        userId: user.id,
        status: 'PENDING',
        dueDate: {
          lte: now
        }
      }
    })

    // Process each reminder
    for (const reminder of reminders) {
      try {
        // Send reminder email
        await sendTransactionEmail(user.email!, 'reminder', reminder)

        // Update reminder status
        await db.reminder.update({
          where: { id: reminder.id },
          data: { 
            status: 'COMPLETED' 
          }
        })
      } catch (reminderError) {
        console.error('Error processing reminder:', reminderError)
      }
    }

    // Process Recurring Transactions
    const recurringTransactions = await db.recurringTransaction.findMany({
      where: {
        userId: user.id,
        isActive: true,
        nextOccurrence: {
          lte: now
        }
      }
    })

    // Process each recurring transaction
    for (const transaction of recurringTransactions) {
      try {
        // Create new transaction
        const newTransaction = await db.expense.create({
          data: {
            userId: user.id,
            // type: transaction.type,
            amount: transaction.amount,
            // title: transaction.title ,
            description: transaction.description || '',
            category: transaction.category as CategoryTypes,
            date: new Date()
          }
        })

        // Calculate next occurrence
        const nextOccurrence = calculateNextOccurrence(transaction)

        // Update recurring transaction
        await db.recurringTransaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: now,
            nextOccurrence: nextOccurrence,
            // Disable if end date is reached
            isActive: transaction.endDate 
              ? nextOccurrence <= new Date(transaction.endDate) 
              : true
          }
        })

        // Send notification email
        await sendTransactionEmail(user.email!, 'recurring', {
          ...transaction,
          nextOccurrence
        })
      } catch (transactionError) {
        console.error('Error processing recurring transaction:', transactionError)
      }
    }

    return { 
      success: true,
      remindersProcessed: reminders.length,
      recurringTransactionsProcessed: recurringTransactions.length
    }
  } catch (error) {
    console.error('Error processing reminders and transactions:', error)
    return { 
      error: "Failed to process reminders and transactions",
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}