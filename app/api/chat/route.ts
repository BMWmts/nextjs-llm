import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Get the latest message from the user
    const latestMessage = messages[messages.length - 1]?.content || ""

    // Initialize the Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    // Generate content
    const result = await model.generateContent(latestMessage)
    const response = await result.response
    const aiResponse = response.text()

    // Store the conversation in Supabase
    const { error: dbError } = await supabase.from("chat_messages").insert({
      user_id: user.id,
      user_email: user.email,
      user_message: latestMessage,
      ai_response: aiResponse,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      // Still return the AI response even if DB storage fails
    }

    return new Response(JSON.stringify({ message: aiResponse }), {
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
