"use client"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { User, LogOut, Settings, ChevronDown } from "lucide-react"

interface UserProfileProps {
  user: {
    id: string
    email?: string
    user_metadata?: {
      avatar_url?: string
      full_name?: string
      name?: string
      picture?: string
    }
  }
}

export function UserProfile({ user }: UserProfileProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const logout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get user display name
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User"

  // Get user avatar - Google uses 'picture' instead of 'avatar_url'
  const avatarUrl = user.user_metadata?.picture || user.user_metadata?.avatar_url

  // Get initials for fallback
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative">
      <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2" onClick={() => setIsOpen(!isOpen)}>
        <Avatar className="h-8 w-8">
          {avatarUrl && <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />}
          <AvatarFallback className="text-xs bg-black text-white">{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 z-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  {avatarUrl && <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />}
                  <AvatarFallback className="bg-black text-white">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="py-1">
              <div
                className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <User className="mr-3 h-4 w-4" />
                <span>Profile</span>
              </div>
              <div
                className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="mr-3 h-4 w-4" />
                <span>Settings</span>
              </div>
              <div className="border-t border-gray-100 my-1" />
              <div
                className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 text-red-600"
                onClick={logout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>{isLoading ? "Logging out..." : "Log out"}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
