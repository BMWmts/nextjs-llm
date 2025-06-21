import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserProfile } from "@/components/user-profile"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    console.log("No user found, redirecting to login")
    redirect("/auth/login")
  }

  console.log("User authenticated:", data.user.email)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
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
          <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back!</h2>
            <p className="text-gray-600 mb-6">You are successfully logged in as {data.user.email}</p>
            <div className="space-y-4">
              <a
                href="/chat"
                className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Start AI Chat
              </a>
              <div className="text-sm text-gray-500">
                <p>✅ Authentication successful</p>
                <p>✅ Session active</p>
                <p>✅ Ready to chat with AI</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
