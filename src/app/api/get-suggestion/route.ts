import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: Request) {
  try {
    const prompt =
      "Generate unique financial advice for a user with a budget of ₹10,000, expenses of ₹10,000, and income of ₹2,000. Provide personalized tips for managing deficits, focusing on cutting expenses, boosting income, and practicing mindful spending, using engaging language and emojis for clarity. and make it in two-three line."

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // For this example, we'll use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ result: text })
  } catch (error: any) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      { error: "Failed to generate content", details: error.message },
      { status: 500 }
    )
  }
}
