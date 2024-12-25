import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  //get reminder data
  const reminderData = await fetchReminderData()

  //get recurring transaction data which have next occurrence after 2 days
  const recurringTransactionData = await fetchRecurringTransactionData()

  console.log("reminderData")
  console.log(reminderData)

  console.log("recurringTransactionData")
  console.log(recurringTransactionData)

  try {
    // Sending reminder emails
    await sendEmails(reminderData)
  } catch (error) {
    console.error("Failed to send reminder emails:", error)
  }

  try {
    // Sending recurring transaction emails
    await sendEmails(recurringTransactionData)
  } catch (error) {
    console.error("Failed to send recurring transaction emails:", error)
  }

  console.log("Emails sent successfully")

  return NextResponse.json({ message: "Mail sent successfully" })
}
// get reminder data
async function fetchReminderData() {
    const startOfTargetDate = new Date();
    startOfTargetDate.setDate(startOfTargetDate.getDate() + 2);
    startOfTargetDate.setHours(0, 0, 0, 0); // Start of the target day
    const endOfTargetDate = new Date(startOfTargetDate);
    endOfTargetDate.setHours(23, 59, 59, 999); // End of the target day
  
    const reminderData = await db.reminder.findMany({
      where: {
        status: "PENDING",
        dueDate: {
          gte: startOfTargetDate,
          lte: endOfTargetDate,
        },
      },
      include: {
        user: true,
      },
    });
  
    return reminderData;
  }
  
  // get recurring transaction data
  async function fetchRecurringTransactionData() {
    const startOfTargetDate = new Date();
    startOfTargetDate.setDate(startOfTargetDate.getDate() + 2);
    startOfTargetDate.setHours(0, 0, 0, 0); // Start of the target day
    const endOfTargetDate = new Date(startOfTargetDate);
    endOfTargetDate.setHours(23, 59, 59, 999); // End of the target day
  
    const recurringTransactionData = await db.recurringTransaction.findMany({
      where: {
        nextOccurrence: {
          gte: startOfTargetDate,
          lte: endOfTargetDate,
        },
      },
      include: {
        user: true,
      },
    });
  
    return recurringTransactionData;
  }
  
  // Group reminders and recurring transactions by user
  function groupByUser(reminders, recurringTransactions) {
    const groupedData = {};
  
    reminders.forEach(reminder => {
      if (!groupedData[reminder.user.email]) {
        groupedData[reminder.user.email] = { reminders: [], recurringTransactions: [] };
      }
      groupedData[reminder.user.email].reminders.push(reminder);
    });
  
    recurringTransactions.forEach(transaction => {
      if (!groupedData[transaction.user.email]) {
        groupedData[transaction.user.email] = { reminders: [], recurringTransactions: [] };
      }
      groupedData[transaction.user.email].recurringTransactions.push(transaction);
    });
  
    return groupedData;
  }
  
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  
  // Send email to users
  async function sendEmails(groupedData) {
    for (const userEmail in groupedData) {
      const user = groupedData[userEmail];
      const emailContent = generateEmailContent(user);
      const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: "SpendWise - Reminder and Recurring Transaction",
        html: emailContent,
      };
  
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail}`);
      } catch (error) {
        console.error(`Failed to send email to ${userEmail}:`, error);
      }
    }
  }
  
  // Generate email content
  function generateEmailContent(user) {
    const remindersContent = user.reminders
      .map(
        reminder => `
          <tr>
            <td>${reminder.title}</td>
            <td>₹${reminder.amount}</td>
            <td>${new Date(reminder.dueDate).toLocaleDateString()}</td>
            <td>${reminder.description}</td>
          </tr>
        `
      )
      .join("");
  
    const recurringTransactionsContent = user.recurringTransactions
      .map(
        transaction => `
          <tr>
            <td>${transaction.title}</td>
            <td>₹${transaction.amount}</td>
            <td>${new Date(transaction.nextOccurrence).toLocaleDateString()}</td>
            <td>${transaction.category}</td>
            <td>${transaction.frequency}</td>
          </tr>
        `
      )
      .join("");
  
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4; }
          .header { font-size: 20px; font-weight: bold; margin-bottom: 20px; }
          .info { font-size: 16px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <p class="header">Hello ${user.reminders[0].user.name},</p>
          <p class="info">You have the following reminders and recurring transactions:</p>
  
          <h3>Upcoming Reminders:</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${remindersContent}
            </tbody>
          </table>
  
          <h3>Upcoming Recurring Transactions:</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Next Occurrence</th>
                <th>Category</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              ${recurringTransactionsContent}
            </tbody>
          </table>
  
          <p>Please make sure to complete the payments and review your recurring transactions.</p>
        </div>
      </body>
      </html>
    `;
  }
  
  // Main function to fetch data and send emails
  async function main() {
    const reminders = await fetchReminderData();
    const recurringTransactions = await fetchRecurringTransactionData();
    const groupedData = groupByUser(reminders, recurringTransactions);
    await sendEmails(groupedData);
  }
  
  main().catch(console.error);
  