"use client"

import type React from "react"

import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LogoutForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()
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

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Out</CardTitle>
        <CardDescription>Are you sure you want to sign out of your account?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogout} className="space-y-4">
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" className="flex-1" disabled={isLoading}>
              {isLoading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
