import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Initialize the Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    // Get the latest message from the user
    const latestMessage = messages[messages.length - 1]?.content || ""

    // Generate content
    const result = await model.generateContent(latestMessage)
    const response = await result.response
    const text = response.text()

    return new Response(JSON.stringify({ message: text }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
