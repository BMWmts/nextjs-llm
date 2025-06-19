import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ChatBot } from "@/components/chat-bot"
import { UserProfile } from "@/components/user-profile"

export default async function ChatPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">AI Chat</h1>
            </div>
            <div className="flex items-center space-x-4">
              <UserProfile user={data.user} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ChatBot />
        </div>
      </main>
    </div>
  )
}
