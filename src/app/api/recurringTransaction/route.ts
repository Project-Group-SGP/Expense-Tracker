import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { db } from "@/lib/db"
import { CategoryTypes } from "@prisma/client"

export async function GET(request: NextRequest) {
  console.log(
    "[Cron] Starting recurring transaction reminder job:",
    new Date().toISOString()
  )

  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error("[Cron] Unauthorized attempt to run transaction reminder")
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const startTime = Date.now()

    // Fetch required data
    const [
      reminderData1,
      reminderData2,
      recurringTransactionData1,
      recurringTransactionData2,
    ] = await Promise.all([
      fetchReminderData(1),
      fetchReminderData(2),
      fetchRecurringTransactionData(1),
      fetchRecurringTransactionData(2),
    ])

    console.log(
      `[Cron] Processing ${reminderData1.length} reminders and ${recurringTransactionData1.length} transactions`
    )
    console.log(
      `[Cron] Processing ${reminderData2.length} reminders and ${recurringTransactionData2.length} transactions`
    )

    // Execute operations
    await Promise.all([
      sendEmails(reminderData1, recurringTransactionData1, 1),
      sendEmails(reminderData2, recurringTransactionData2, 2),
      setNextOccurrence(),
      setReminderStatus(),
    ])

    const duration = Date.now() - startTime
    console.log(`[Cron] Job completed successfully in ${duration}ms`)

    return NextResponse.json({
      success: true,
      message: "Reminders processed successfully",
      stats: {
        reminders: reminderData1.length + reminderData2.length,
        transactions:
          recurringTransactionData1.length + recurringTransactionData2.length,
        duration,
      },
    })
  } catch (error) {
    console.error("[Cron] Job failed:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// get reminder data
async function fetchReminderData(daysAhead) {
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + daysAhead)
  targetDate.setHours(0, 0, 0, 0) // Start of the target day

  const endOfTargetDate = new Date(targetDate)
  endOfTargetDate.setHours(23, 59, 59, 999) // End of the target day

  const reminderData = await db.reminder.findMany({
    where: {
      dueDate: {
        gte: targetDate,
        lte: endOfTargetDate,
      },
    },
    include: {
      user: true,
    },
  })

  // format reminder data
  function formatReminders(reminderData) {
    return reminderData.map((reminder) => ({
      email: reminder.user.email,
      name: reminder.user.name,
      title: reminder.title,
      amount: `₹${reminder.amount}`,
      description: reminder.description,
      category: reminder.category,
      dueDate: new Date(reminder.dueDate).toLocaleDateString(),
    }))
  }

  return formatReminders(reminderData)
}

// get recurring transaction data
async function fetchRecurringTransactionData(daysAhead) {
  const startOfTargetDate = new Date()
  startOfTargetDate.setDate(startOfTargetDate.getDate() + daysAhead)
  startOfTargetDate.setHours(0, 0, 0, 0) // Start of the target day
  const endOfTargetDate = new Date(startOfTargetDate)
  endOfTargetDate.setHours(23, 59, 59, 999) // End of the target day

  // get recurring transaction data if it has next occurrence after 2 days
  // and is active (true)
  const recurringTransactionData = await db.recurringTransaction.findMany({
    where: {
      nextOccurrence: {
        gte: startOfTargetDate,
        lte: endOfTargetDate,
      },
      isActive: true,
    },
    include: {
      user: true,
    },
  })

  // format recurring transaction data
  function formatRecurringTransactions(recurringTransactionData) {
    return recurringTransactionData.map((transaction) => ({
      email: transaction.user.email,
      name: transaction.user.name,
      title: transaction.title,
      amount: `₹${transaction.amount}`,
      description: transaction.description,
      category: transaction.category,
      nextOccurrence: new Date(transaction.nextOccurrence).toLocaleDateString(),
      frequency:
        transaction.frequency === "CUSTOM"
          ? `Every ${transaction.customInterval} days`
          : transaction.frequency,
    }))
  }

  return formatRecurringTransactions(recurringTransactionData)
}

async function sendEmails(reminderData, recurringTransactionData, day) {
  const groupedData = {}

  // Group reminders by email
  reminderData.forEach((reminder) => {
    const { email, name, title, amount, category, description, dueDate } =
      reminder
    if (!groupedData[email]) {
      groupedData[email] = {
        name,
        reminders: [],
        recurringTransactions: [],
      }
    }
    groupedData[email].reminders.push({
      title,
      amount,
      description,
      dueDate,
      category,
    })
  })

  // Group recurring transactions by email
  recurringTransactionData.forEach((transaction) => {
    const {
      email,
      name,
      title,
      amount,
      description,
      category,
      nextOccurrence,
      frequency,
    } = transaction
    if (!groupedData[email]) {
      groupedData[email] = {
        name,
        reminders: [],
        recurringTransactions: [],
      }
    }
    groupedData[email].recurringTransactions.push({
      title,
      amount,
      description,
      category,
      nextOccurrence,
      frequency,
    })
  })

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })
  // Send emails
  for (const email in groupedData) {
    const user = groupedData[email]

    const emailContent = generateEmailContent(user, day) // Generate email HTML content
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Your Notifications - ${user.name}`,
      html: emailContent,
    }

    try {
      await transporter.sendMail(mailOptions)
      console.log(`Email sent to ${email}`)
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error)
    }
  }
}

// Helper function to generate email content
function generateEmailContent(user, day) {
  // Inline styles for email compatibility
  const content = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SpendWise Reminder</title>
    <style>
        /* Hide scrollbar for Chrome, Safari and Opera */
        .table-container::-webkit-scrollbar {
            display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .table-container {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
    </style>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 10px; background-color: #fbfcfc;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; width: 100%; box-sizing: border-box;">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://trackwithspendwise.vercel.app/SpendWIse-5.png" alt="SpendWise Logo" style="width: 120px; height: auto; max-width: 100%;">
        </div>

        <!-- Header -->
        <h1 style="color: #4CAF50; text-align: center; margin-bottom: 20px; font-size: clamp(20px, 4vw, 28px);">Recurring Transaction Reminder</h1>
        
        <!-- Greeting -->
        <p style="font-weight: bold; margin-bottom: 15px; font-size: clamp(16px, 3vw, 18px);">Hi ${user.name},</p>
        <p style="font-size: 16px;">This is a reminder about your upcoming recurring payment:</p>

        <!-- Highlight Box -->
        <div style="background-color: #fff3e0; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ff9800;">
            <p style="margin: 0; font-size: 16px;">Your next payment is due in <strong>${day} days</strong></p>
        </div>

        ${
          user.reminders && user.reminders.length > 0
            ? `
            <!-- Reminders Table -->
            <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 5px; font-size: clamp(18px, 3vw, 22px);">Reminders</h2>
            <div class="table-container" style="overflow-x: auto; margin: 15px 0; -webkit-overflow-scrolling: touch;">
                <table style="width: 100%; min-width: 600px; border-collapse: separate; border-spacing: 0; border-radius: 8px; overflow: hidden;">
                    <thead>
                        <tr style="background-color: #e8f5e9;">
                            <th style="padding: 12px 15px; text-align: left; color: #2e7d32; font-weight: bold; text-transform: uppercase; font-size: 14px; white-space: nowrap;">Title</th>
                            <th style="padding: 12px 15px; text-align: left; color: #2e7d32; font-weight: bold; text-transform: uppercase; font-size: 14px; white-space: nowrap;">Amount</th>
                            <th style="padding: 12px 15px; text-align: left; color: #2e7d32; font-weight: bold; text-transform: uppercase; font-size: 14px; white-space: nowrap;">Due Date</th>
                            <th style="padding: 12px 15px; text-align: left; color: #2e7d32; font-weight: bold; text-transform: uppercase; font-size: 14px; white-space: nowrap;">Category</th>
                            <th style="padding: 12px 15px; text-align: left; color: #2e7d32; font-weight: bold; text-transform: uppercase; font-size: 14px; white-space: nowrap;">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${user.reminders
                          .map(
                            (reminder) => `
                            <tr style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 12px 15px; white-space: nowrap;">${reminder.title}</td>
                                <td style="padding: 12px 15px; white-space: nowrap;">${reminder.amount}</td>
                                <td style="padding: 12px 15px; white-space: nowrap;">${reminder.dueDate}</td>
                                <td style="padding: 12px 15px; white-space: nowrap;">${reminder.category}</td>
                                <td style="padding: 12px 15px; white-space: nowrap;">${reminder.description}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
          `
            : `
            <div style="background-color: #fff3e0; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ff9800;">
                <p style="margin: 0; font-size: 16px;">No reminders at the moment.</p>
            </div>
          `
        }

        ${
          user.recurringTransactions && user.recurringTransactions.length > 0
            ? `
            <!-- Recurring Transactions Table -->
            <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 5px; font-size: clamp(18px, 3vw, 22px);">Recurring Transactions</h2>
            <div class="table-container" style="overflow-x: auto; margin: 15px 0; -webkit-overflow-scrolling: touch;">
                <table style="width: 100%; min-width: 600px; border-collapse: separate; border-spacing: 0; border-radius: 8px; overflow: hidden;">
                    <thead>
                        <tr style="background-color: #e8f5e9;">
                            <th style="padding: 12px 15px; text-align: left; color: #2e7d32; font-weight: bold; text-transform: uppercase; font-size: 14px; white-space: nowrap;">Description</th>
                            <th style="padding: 12px 15px; text-align: left; color: #2e7d32; font-weight: bold; text-transform: uppercase; font-size: 14px; white-space: nowrap;">Amount</th>
                            <th style="padding: 12px 15px; text-align: left; color: #2e7d32; font-weight: bold; text-transform: uppercase; font-size: 14px; white-space: nowrap;">Next Occurrence</th>
                            <th style="padding: 12px 15px; text-align: left; color: #2e7d32; font-weight: bold; text-transform: uppercase; font-size: 14px; white-space: nowrap;">Frequency</th>
                            <th style="padding: 12px 15px; text-align: left; color: #2e7d32; font-weight: bold; text-transform: uppercase; font-size: 14px; white-space: nowrap;">Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${user.recurringTransactions
                          .map(
                            (transaction) => `
                            <tr style="background-color: #ffffff; border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 12px 15px; white-space: nowrap;">${transaction.title}</td>
                                <td style="padding: 12px 15px; white-space: nowrap;">${transaction.amount}</td>
                                <td style="padding: 12px 15px; white-space: nowrap;">${transaction.nextOccurrence}</td>
                                <td style="padding: 12px 15px; white-space: nowrap;">${transaction.frequency}</td>
                                <td style="padding: 12px 15px; white-space: nowrap;">${transaction.category}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
          `
            : `
            <div style="background-color: #fff3e0; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ff9800;">
                <p style="margin: 0; font-size: 16px;">No recurring transactions found.</p>
            </div>
          `
        }

        <!-- Instructions -->
        <p style="font-size: 16px;">This is an automated reminder for your recurring expense. Please ensure to:</p>
        <ul style="padding-left: 20px;">
            <li style="margin-bottom: 10px; font-size: 16px;">Review the payment details</li>
            <li style="margin-bottom: 10px; font-size: 16px;">Mark as paid once you've completed the transaction</li>
            <li style="margin-bottom: 10px; font-size: 16px;">Update any changes in the recurring schedule if needed</li>
        </ul>

        <!-- Footer -->
        <div style="margin-top: 20px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            <p style="margin: 5px 0;">SpendWise - Helping you manage your recurring expenses wisely</p>
            <p style="margin: 5px 0;">You're receiving this because you set up a recurring transaction reminder.</p>
        </div>
    </div>
</body>
</html>
  `

  return content
}

// set next occurrence for recurring transaction according to frequency
async function setNextOccurrence() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Start of today

    const endOfToday = new Date(today)
    endOfToday.setHours(23, 59, 59, 999) // End of today

    const recurringTransactions = await db.recurringTransaction.findMany({
      where: {
        nextOccurrence: {
          gte: today,
          lte: endOfToday,
        },
      },
    })

    console.log(
      `Found ${recurringTransactions.length} recurring transactions for today.`
    )

    const updates: {
      id: string
      data: { nextOccurrence: Date; lastProcessed: Date }
    }[] = []

    for (const transaction of recurringTransactions) {
      if (!transaction.isActive) {
        console.log(`Skipping inactive transaction: ${transaction.id}`)
        continue
      }

      const { frequency, customInterval, type, amount, userId, description } =
        transaction
      const nextOccurrence = new Date(transaction.nextOccurrence)

      switch (frequency) {
        case "DAILY":
          nextOccurrence.setDate(nextOccurrence.getDate() + 1)
          break
        case "WEEKLY":
          nextOccurrence.setDate(nextOccurrence.getDate() + 7)
          break
        case "MONTHLY":
          nextOccurrence.setMonth(nextOccurrence.getMonth() + 1)
          break
        case "YEARLY":
          nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1)
          break
        case "CUSTOM":
          if (!customInterval) {
            console.error(
              `No custom interval set for transaction: ${transaction.id}`
            )
            throw new Error(
              `Missing custom interval for transaction: ${transaction.id}`
            )
          }
          nextOccurrence.setDate(nextOccurrence.getDate() + customInterval)
          break
        default:
          console.error(
            `Unknown frequency: ${frequency} for transaction: ${transaction.id}`
          )
          throw new Error(`Unknown frequency: ${frequency}`)
      }

      // Add to updates for nextOccurrence and lastProcessed
      updates.push({
        id: transaction.id,
        data: {
          nextOccurrence,
          lastProcessed: new Date(),
        },
      })

      // Insert into income or expense table based on transaction type
      if (type === "INCOME") {
        await db.income.create({
          data: {
            userId,
            amount,
            description: "Income from recurring transaction",
            date: new Date(), // Current date
          },
        })
      } else if (type === "EXPENSE") {
        await db.expense.create({
          data: {
            userId,
            amount,
            description: "Expense from recurring transaction",
            date: new Date(), // Current date
            category: transaction.category as CategoryTypes, // Include category
          },
        })
      } else {
        console.error(
          `Unknown transaction type: ${type} for transaction: ${transaction.id}`
        )
      }
    }

    // Perform updates in a batch
    for (const update of updates) {
      await db.recurringTransaction.update({
        where: { id: update.id },
        data: update.data,
      })
    }

    console.log(`Updated ${updates.length} recurring transactions.`)
  } catch (error) {
    console.error("Error in setNextOccurrence:", error)
    throw error // Re-throw to allow higher-level error handling if needed
  }
}

// set Reminder status to COMPLETED
async function setReminderStatus() {
  try {
    const startOfTargetDate = new Date()
    // startOfTargetDate.setDate(startOfTargetDate.getDate() + 2)
    startOfTargetDate.setHours(0, 0, 0, 0) // Start of the target day
    const endOfTargetDate = new Date(startOfTargetDate)
    endOfTargetDate.setHours(23, 59, 59, 999) // End of the target day

    try {
      const recurringTransactions = await db.reminder.updateMany({
        where: {
          dueDate: {
            gte: startOfTargetDate,
            lte: endOfTargetDate,
          },
        },
        data: { status: "COMPLETED" },
      })
      console.log(` ${recurringTransactions.count} Reminder updated.`)
    } catch (error) {
      console.error("Error updating transactions:", error)
    }
  } catch (error) {
    console.error("Error in setReminderStatus:", error)
    throw error // Re-throw to allow higher-level error handling if needed
  }
}
