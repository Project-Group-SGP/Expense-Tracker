"use server"
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { ExpenseFormData } from "./_components/NewExpense"
import { IncomeFormData } from "./_components/Newincome"
import { revalidateTag } from "next/cache"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText, streamText } from "ai"
import { createStreamableValue } from "ai/rsc"
import { CategoryTypes } from "@prisma/client"
import { GoogleGenerativeAI } from "@google/generative-ai"

export type Month =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December"

const monthNames: Month[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

type MonthlyFinancialData = {
  month: string
  totalIncome: number
  totalExpenses: number
  netSavings: number
  expensesByCategory: Record<CategoryTypes, number>
  budgetByCategory: Record<CategoryTypes, number>
  budgetVarianceByCategory: Record<CategoryTypes, number>
}

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

  revalidateTag("totalExpense")
  revalidateTag("getAllData")

  return newExpense ? "success" : "error"
}

export async function generateFinancialAdvice(
  startMonth: Month,
  endMonth: Month
) {
  try {
    const user = await currentUserServer()
    if (!user) {
      throw new Error("Please log in.")
    }

    if (monthNames.indexOf(startMonth) > monthNames.indexOf(endMonth)) {
      throw new Error("Start month cannot be greater than end month.")
    }

    const currentYear = new Date().getFullYear()
    const startDate = new Date(currentYear, monthNames.indexOf(startMonth), 1)
    const endDate = new Date(currentYear, monthNames.indexOf(endMonth) + 1, 0)

    const expenses = await db.expense.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const incomes = await db.income.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    if (incomes.length === 0 && expenses.length === 0) {
      throw new Error("No data found for the selected period.")
    }

    const budgets = await db.category.findMany({
      where: {
        userId: user.id,
      },
    })

    const monthlyData: MonthlyFinancialData[] = []

    for (
      let i = monthNames.indexOf(startMonth);
      i <= monthNames.indexOf(endMonth);
      i++
    ) {
      const monthStart = new Date(currentYear, i, 1)
      const monthEnd = new Date(currentYear, i + 1, 0)

      const monthExpenses = expenses.filter(
        (e) => e.date >= monthStart && e.date <= monthEnd
      )
      const monthIncomes = incomes.filter(
        (i) => i.date >= monthStart && i.date <= monthEnd
      )

      const totalExpenses = monthExpenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      )
      const totalIncome = monthIncomes.reduce(
        (sum, income) => sum + Number(income.amount),
        0
      )
      const netSavings = totalIncome - totalExpenses

      const expensesByCategory = monthExpenses.reduce(
        (acc, expense) => {
          acc[expense.category] =
            (acc[expense.category] || 0) + Number(expense.amount)
          return acc
        },
        {} as Record<CategoryTypes, number>
      )

      const budgetByCategory = budgets.reduce(
        (acc, budget) => {
          acc[budget.category] = Number(budget.budget)
          return acc
        },
        {} as Record<CategoryTypes, number>
      )

      const budgetVarianceByCategory = Object.entries(budgetByCategory).reduce(
        (acc, [category, budget]) => {
          acc[category as CategoryTypes] =
            budget - (expensesByCategory[category as CategoryTypes] || 0)
          return acc
        },
        {} as Record<CategoryTypes, number>
      )

      monthlyData.push({
        month: monthNames[i],
        totalIncome,
        totalExpenses,
        netSavings,
        expensesByCategory,
        budgetByCategory,
        budgetVarianceByCategory,
      })
    }

    const overallTotalExpenses = monthlyData.reduce(
      (sum, month) => sum + month.totalExpenses,
      0
    )
    const overallTotalIncome = monthlyData.reduce(
      (sum, month) => sum + month.totalIncome,
      0
    )
    const overallNetSavings = overallTotalIncome - overallTotalExpenses

    const overallExpensesByCategory = monthlyData.reduce(
      (acc, month) => {
        Object.entries(month.expensesByCategory).forEach(
          ([category, amount]) => {
            acc[category as CategoryTypes] =
              (acc[category as CategoryTypes] || 0) + amount
          }
        )
        return acc
      },
      {} as Record<CategoryTypes, number>
    )

    const overallBudgetByCategory = budgets.reduce(
      (acc, budget) => {
        acc[budget.category] = Number(budget.budget) * monthlyData.length
        return acc
      },
      {} as Record<CategoryTypes, number>
    )

    const overallBudgetVarianceByCategory = Object.entries(
      overallBudgetByCategory
    ).reduce(
      (acc, [category, budget]) => {
        acc[category as CategoryTypes] =
          budget - (overallExpensesByCategory[category as CategoryTypes] || 0)
        return acc
      },
      {} as Record<CategoryTypes, number>
    )

    const financialSummary = {
      period: `${startMonth} to ${endMonth} ${currentYear}`,
      monthlyData,
      overall: {
        totalIncome: overallTotalIncome,
        totalExpenses: overallTotalExpenses,
        netSavings: overallNetSavings,
        expensesByCategory: overallExpensesByCategory,
        budgetByCategory: overallBudgetByCategory,
        budgetVarianceByCategory: overallBudgetVarianceByCategory,
      },
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_MAIL_API_KEY,
    })

    const model = google("gemini-1.5-flash-002", {
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_LOW_AND_ABOVE",
        },
      ],
    })

    const prompt = `
    Keep the answer short and concise.
    As a financial advisor, analyze the following detailed financial data, including budget information, and provide a comprehensive summary and actionable advice:
    ${JSON.stringify(financialSummary, null, 2)}

    Please provide:
    1. A concise summary of the user's overall financial situation for the entire period
    2. Month-by-month analysis of income and expenses trends 
    3. Insights on spending patterns across different categories, comparing actual expenses to budgeted amounts
    4. Identification of categories where the user is consistently over or under budget
    5. Analysis of the user's budgeting accuracy and suggestions for improvement
       Note that the budgets provided for categories and total budget are monthly
    6. Recommendations for improving financial health, including:
       - Suggestions for adjusting budgets in specific categories
       - Ideas for reducing expenses in over-budget categories
       - Advice on reallocating funds from under-budget categories
       - Strategies for increasing savings
    7. Specific, actionable steps the user can take in the coming month to better align with their budget and financial goals

    Format your response for react-markdown, using headers, subheaders, title etc for clarity.

     To make the response more engaging and relatable:
    - Use a friendly, conversational tone throughout your analysis and advice
    - Include relevant emojis in your headers, key points, and recommendations to add visual interest and emphasize important information
    - Make the financial advice feel personal and actionable, as if you're having a one-on-one conversation with the user
    - Use encouraging language to motivate the user and make them feel positive about taking control of their finances
    - Make the response short and concise
    - Also use tables if required and don't mention any currency symbol in it
    - give answer in rupees not in dollars
    - Don't tell user to use any other apps tell them to user our website
    Remember, the goal is to provide clear, actionable financial advice while keeping the tone upbeat and engaging!
    Note: I am using React-Markdown + Remark-gfm for displaying the text so generate response accordingly
    `

    const stream = createStreamableValue("")
    try {
      ;(async () => {
        const { textStream } = await streamText({
          model: model,
          prompt: prompt,
        })

        for await (const delta of textStream) {
          stream.update(delta)
          console.log("Streaming update:", delta)
        }

        stream.done()
        console.log("Stream completed successfully")
      })()
    } catch (error) {
      console.error("Error during stream generation:", error)
      stream.error(error)
    }

    return { output: stream.value }
  } catch (error: any) {
    console.error("Error generating content:", error)
    return { error: "Failed to generate content", details: error.message }
  }
}

export async function AnalayzeBill(imageBase64: string) {
  try {
    // Validate input is an image
    if (!imageBase64 || typeof imageBase64 !== "string") {
      throw new Error(
        "Invalid input: Must provide a base64 encoded image string"
      )
    }

    // Check if the string is a valid base64 image
    const isBase64Image = /^data:image\/(jpeg|png|jpg|gif|webp);base64,/.test(
      imageBase64
    )
    if (!isBase64Image) {
      throw new Error("Invalid input: Must be a base64 encoded image")
    }

    const user = await currentUserServer()
    if (!user) {
      throw new Error("Please log in.")
    }

    // Initialize the Google Generative AI with your API key
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_MAIL_API_KEY as string
    )

    // Get the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-002",
    })

    const prompt = `
Analyze this image and determine if it's a bill/receipt or not.

If it IS a bill or receipt:
1. Extract the total amount
2. Extract the date of transaction (in YYYY-MM-DD format)
   - If the date is not visible in the receipt, indicate this with "date_not_found" instead of making up a date
3. Extract a brief description of what the bill/receipt is for
4. Determine the expense category from: ${Object.values(CategoryTypes).join(", ")}

If it is NOT a bill or receipt:
1. Identify what type of image it is (e.g., "landscape photo", "portrait", "screenshot", etc.)

Format your response as a valid JSON object with these exact keys:
{
  "isBill": boolean,
  "type": string, // "bill" or the identified image type if not a bill
  "data": {
    // If isBill is true:
    "totalAmount": number,
    "date": string, // YYYY-MM-DD or "date_not_found" if not visible
    "description": string, // Brief description of what the bill is for
    "category": string // One of the categories listed above
    
    // If isBill is false:
    "description": string // Brief description of what the image contains
  }
}

Return ONLY the JSON object, nothing else.
`
    // Extract the base64 data without the MIME prefix
    const base64Data = imageBase64.split(",")[1]

    // Create a content part with the image
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: imageBase64.match(/data:(.*?);base64/)?.[1] || "image/jpeg",
      },
    }

    // Generate content with the image and prompt
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, imagePart],
        },
      ],
    })

    const response = result.response
    const text = response.text()
    console.log("Response text:", text)

    // Parse the response
    try {
      const jsonTextMatch = text.match(/(\{[\s\S]*\})/)
      const cleanedText = jsonTextMatch ? jsonTextMatch[0] : text
      const result = JSON.parse(cleanedText)

      // If this is a bill and the date was not found, use today's date in Indian format
      if (result.isBill === true && result.data.date === "date_not_found") {
        // Create a date object for today in Indian time
        const options = { timeZone: "Asia/Kolkata" }
        const today = new Date()

        // Format as YYYY-MM-DD
        const year = today.toLocaleString("en-US", {
          year: "numeric",
          timeZone: "Asia/Kolkata",
        })
        // Month is 0-indexed, so add 1 and pad with leading zero if needed
        const month = String(
          today.toLocaleString("en-US", {
            month: "numeric",
            timeZone: "Asia/Kolkata",
          })
        ).padStart(2, "0")
        const day = String(
          today.toLocaleString("en-US", {
            day: "numeric",
            timeZone: "Asia/Kolkata",
          })
        ).padStart(2, "0")

        result.data.date = `${year}-${month}-${day}`
      }

      return result
    } catch (error) {
      console.error("Error parsing AI response:", error)
      throw new Error("Failed to parse the analysis result")
    }
  } catch (error: any) {
    console.error("Error analyzing bill:", error)
    return {
      error: true,
      message: error.message || "Failed to analyze the image",
    }
  }
}

export async function processPrompt(prompt: string) {
  const user = await currentUserServer()
  if (!user || !user.id) {
    throw new Error("User not authenticated")
  }
  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error(
        "Invalid request: prompt is required and must be a string"
      )
    }

    // Initialize the Google Generative AI model
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_MAIL_API_KEY as string,
    })

    const model = google("gemini-1.5-flash-002", {
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_LOW_AND_ABOVE",
        },
      ],
    })

    // Create a streamable value to return to the client
    const stream = createStreamableValue()

    // Use a system prompt that instructs the AI to determine if the query is financial
    const systemPrompt = `
      You are a specialized financial advisor assistant. 
      
      First, determine if the user's query is related to finance, money, budgeting, investing, 
      or other financial topics.
      
      If the query IS financial in nature:
      - Provide helpful, accurate, and concise financial advice
      - Be informative and educational
      
      If the query is NOT financial in nature:
      - Politely explain that you're specialized in financial topics
      - Suggest that they rephrase their question to be finance-related
      - Do not answer non-financial questions
      
      Always maintain a professional and helpful tone.
    `

    ;(async () => {
      try {
        const { textStream } = await streamText({
          model: model,
          system: systemPrompt,
          prompt: prompt,
        })

        for await (const text of textStream) {
          stream.update(text)
        }

        stream.done()
      } catch (error) {
        console.error("Error generating response:", error)
        stream.error(
          error instanceof Error
            ? error
            : new Error("Failed to generate response")
        )
      }
    })()

    return stream.value
  } catch (error) {
    console.error("Error processing prompt:", error)
    throw error
  }
}
