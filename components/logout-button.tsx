"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/buttonna"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Out</CardTitle>
        <CardDescription>Are you sure you want to sign out of your account?</CardDescription>
      </CardHeader>
          <div className="flex gap-2">
            <Button onClick={logout} disabled={isLoading} type="button" variant="outline" className="flex-1">
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </div>
    </Card>
  )
}
