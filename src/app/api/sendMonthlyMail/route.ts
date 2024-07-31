// import { db } from "@/lib/db"
// import { createGoogleGenerativeAI } from "@ai-sdk/google"
// import { generateText } from "ai"
// import { NextResponse } from "next/server"

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_MAIL_API_KEY,
// })

// const model = google("models/gemini-1.5-flash-latest")

// async function generateSuggestion(userData) {
//   const prompt = `
//     Based on the following financial data for a user of the Spendwise expense tracker app:
//     - Name: ${userData.name}
//     - Total Budget: ${userData.budget}
//     - Total Income: ${userData.totalIncome}
//     - Total Expenses: ${userData.totalExpenses}
//     - Category-wise Budget: ${JSON.stringify(userData.categoryBudget)}
//     - Category-wise Expenses: ${JSON.stringify(userData.categoryExpenses)}

//     Please provide a concise financial advice email (max 200 words) that includes:
//     1. A personalized greeting using their name
//     2. An overall assessment of their financial health
//     3. Specific suggestions for categories where they're overspending
//     4. Recommendations for better budgeting or saving strategies
//     5. A motivational closing statement

//     Keep the tone friendly and encouraging.
//   `

//   const { text } = await generateText({
//     model,
//     prompt,
//   })

//   return text
// }

// async function fetchUserDataFromQueue(batchSize: number) {
//   const pipeline = redis.pipeline()
//   for (let i = 0; i < batchSize; i++) {
//     pipeline.lpop("userQueue")
//   }
//   const results = await pipeline.exec()
//   return results.map((result) => JSON.parse(result[1]))
// }

// async function processUserData(user) {
//   const currentDate = new Date()
//   const startOfMonth = new Date(
//     currentDate.getFullYear(),
//     currentDate.getMonth(),
//     1
//   )

//   const totalIncome = user.incomes.reduce((sum, income) => {
//     return income.date >= startOfMonth ? sum + income.amount : sum
//   }, 0)

//   const totalExpenses = user.expenses.reduce((sum, expense) => {
//     return expense.date >= startOfMonth ? sum + expense.amount : sum
//   }, 0)

//   const categoryBudget = user.categories.reduce((obj, category) => {
//     obj[category.category] = category.budget
//     return obj
//   }, {})

//   const categoryExpenses = user.expenses.reduce((obj, expense) => {
//     if (expense.date >= startOfMonth) {
//       obj[expense.category] = (obj[expense.category] || 0) + expense.amount
//     }
//     return obj
//   }, {})

//   return {
//     id: user.id,
//     name: user.name,
//     email: user.email,
//     budget: user.budget,
//     totalIncome,
//     totalExpenses,
//     categoryBudget,
//     categoryExpenses,
//   }
// }

// export async function GET() {
//   const batchSize = 15
//   const startTime = Date.now()
//   const timeLimit = 59000 // 59 seconds, leaving 1 second for final processing

//   try {
//     let totalProcessed = 0
//     let callCount = 0

//     while (Date.now() - startTime < timeLimit) {
//       const users = await fetchUserDataFromQueue(batchSize)
//       if (users.length === 0) break

//       for (const user of users) {
//         if (callCount >= 15) {
//           // Wait for a minute before continuing
//           await new Promise((resolve) => setTimeout(resolve, 60000))
//           callCount = 0
//         }

//         const processedUserData = await processUserData(user)
//         const suggestion = await generateSuggestion(processedUserData)

//         // Send email
//         // await sendMail({
//         //   to: user.email,
//         //   subject: "Your Spendwise Financial Insights",
//         //   body: suggestion,
//         // })

//         callCount++
//         totalProcessed++
//       }

//       if (users.length < batchSize) break
//     }

//     return NextResponse.json({ success: true, processedUsers: totalProcessed })
//   } catch (error) {
//     console.error("Error processing users:", error)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }
