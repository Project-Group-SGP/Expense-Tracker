import { db } from "@/lib/db"
import { CategoryTypes, ExpenseStatus, Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import nodemailer from "nodemailer"

type ExpenseQueryResult = {
  id: string
  groupId: string
  paidById: string
  category: CategoryTypes | null
  amount: Prisma.Decimal
  description: string
  date: Date
  status: ExpenseStatus
  createdAt: Date
  paidBy: { id: string; name: string }
  group: { name: string }
  splits: {
    amount: Prisma.Decimal
    user: {
      id: string
      name: string
      email: string
    }
  }[]
}

type UserExpense = {
  name: string
  email: string
  expenses: {
    group: string
    description: string
    amount: number
    paidBy: string
    date: Date
  }[]
}

export async function GET(request: NextRequest) {
  console.log("[Cron] Starting expense reminder job:", new Date().toISOString())
  const authHeader = request.headers.get("authorization")
  console.log("authHeader", authHeader)
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error("[Cron] Unauthorized attempt to run expense reminder")
    return new Response("Unauthorized", {
      status: 401,
    })
  }

  try {
    const startTime = Date.now()
    const [expenses,deletedTokens] = await Promise.all([fetchExpenses(),db.tokens.deleteMany({
      where: {
        expires: {
          lte: new Date(),
        }
      }
    })])

    console.log(`[Cron] Found ${expenses.length} expenses to process`)
    console.log(`[Cron] Cleaned up ${deletedTokens.count} expired tokens`)

    const userExpenses = organizeExpenses(expenses)
    await sendReminderEmails(userExpenses)

    const duration = Date.now() - startTime
    console.log(`[Cron] Job completed successfully in ${duration}ms`)
    return Response.json({
      success: true,
      message: "Reminder emails sent successfully",
    })
  } catch (error) {
    console.error("[Cron] Job failed:", error)
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function fetchExpenses(): Promise<ExpenseQueryResult[]> {
  return (await db.groupExpense.findMany({
    where: {
      status: {
        in: [ExpenseStatus.UNSETTLED, ExpenseStatus.PARTIALLY_SETTLED],
      },
    },
    include: {
      paidBy: { select: { id: true, name: true } },
      group: { select: { name: true } },
      splits: {
        where: { isPaid: "UNPAID" },
        select: {
          amount: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })) as ExpenseQueryResult[]
}

function organizeExpenses(
  expenses: ExpenseQueryResult[]
): Record<string, UserExpense> {
  const userExpenses: Record<string, UserExpense> = {}
  expenses.forEach((expense) => {
    expense.splits.forEach((split) => {
      const userId = split.user.id
      if (!userExpenses[userId]) {
        userExpenses[userId] = {
          name: split.user.name,
          email: split.user.email,
          expenses: [],
        }
      }
      userExpenses[userId].expenses.push({
        group: expense.group.name,
        description: expense.description,
        amount: split.amount.toNumber(),
        paidBy: expense.paidBy.name,
        date: expense.date,
      })
    })
  })
  return userExpenses
}

async function sendReminderEmails(userExpenses: Record<string, UserExpense>) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  const emailPromises = Object.values(userExpenses).map((user) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Your Spendwise Expense Reminder",
      html: createEmailContent(user),
    }

    return transporter.sendMail(mailOptions).then(() => {
      console.log(`Reminder email sent to ${user.email}`)
    })
  })

  await Promise.all(emailPromises)
}

function createEmailContent(user: UserExpense): string {
  const nonZeroExpenses = user.expenses.filter((expense) => expense.amount > 0)
  const total = nonZeroExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  )

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SpendWise Expense Reminder</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                padding: 30px;
            }
            .logo {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo img {
                width: 120px;
                height: auto;
            }
            h1 {
                color: #4CAF50;
                text-align: center;
                margin-bottom: 30px;
                font-size: 28px;
            }
            .greeting {
                font-weight: bold;
                margin-bottom: 20px;
                font-size: 18px;
            }
            .table-container {
                overflow-x: auto;
            }
            table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                margin-top: 20px;
                border-radius: 8px;
                overflow: hidden;
            }
            th, td {
                padding: 12px 15px;
                text-align: left;
                border-bottom: 1px solid #e0e0e0;
            }
            th {
                background-color: #e8f5e9;
                color: #2e7d32;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 14px;
            }
            tr:last-child td {
                border-bottom: none;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .total {
                font-weight: bold;
                margin-top: 20px;
                text-align: right;
                font-size: 18px;
                color: #4CAF50;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 14px;
                color: #666;
                border-top: 1px solid #e0e0e0;
                padding-top: 20px;
            }
            @media only screen and (max-width: 600px) {
                body {
                    padding: 10px;
                }
                .container {
                    padding: 15px;
                }
                table {
                    font-size: 14px;
                }
                th, td {
                    padding: 8px 10px;
                }
                .description-column {
                    display: none;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <img src="https://trackwithspendwise.vercel.app/SpendWIse-5.png" alt="SpendWise Logo">
            </div>
            <h1>Your Spendwise Expense Reminder</h1>
            <p class="greeting">Hello ${user.name},</p>
            <p>This is a friendly reminder about your unpaid expenses:</p>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Group</th>
                            <th class="description-column">Description</th>
                            <th>Amount</th>
                            <th>Paid By</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${nonZeroExpenses
                          .map(
                            (expense) => `
                            <tr>
                                <td>${expense.group}</td>
                                <td class="description-column">${expense.description}</td>
                                <td>₹${expense.amount.toFixed(2)}</td>
                                <td>${expense.paidBy}</td>
                                <td>${formatDate(expense.date)}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
            <p class="total">Total: ₹${total.toFixed(2)}</p>
            <p>We kindly request you to settle these expenses at your earliest convenience. If you have any questions or concerns, please don't hesitate to reach out to us.</p>
            <p>Thank you for your prompt attention to this matter.</p>
            <div class="footer">
                <p>Spendwise - Helping you manage your expenses wisely</p>
            </div>
        </div>
    </body>
    </html>
  `
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year % 100}`
}
