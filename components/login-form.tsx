"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUrl, setCurrentUrl] = useState<string>("")

  useEffect(() => {
    // Set the current URL on client side
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.origin)
    }
  }, [])

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting OAuth login...")
      console.log("Current origin:", currentUrl)

      // Use the current origin for redirect
      const redirectUrl = currentUrl || window.location.origin

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectUrl}/auth/oauth`,
          queryParams: {
            access_type: "online",
            prompt: "consent",
          },
        },
      })

      console.log("OAuth response:", { data, error })

      if (error) {
        console.error("OAuth error:", error)
        throw error
      }
    } catch (error: unknown) {
      console.error("Login error:", error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred during login"
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className={cn("w-full max-w-md", className)} {...props}>
        <Card className="border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Welcome</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSocialLogin}>
              <div className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    <strong>Error:</strong> {error}
                    <details className="mt-2 text-xs">
                      <summary>Debug Info</summary>
                      <p>Current URL: {currentUrl}</p>
                      <p>Redirect will go to: {currentUrl}/auth/oauth</p>
                    </details>
                  </div>
                )}

                {/* Debug info for development */}
                {process.env.NODE_ENV === "development" && (
                  <div className="p-3 text-xs bg-blue-50 border border-blue-200 rounded-lg">
                    <p>
                      <strong>Debug Info:</strong>
                    </p>
                    <p>Current Origin: {currentUrl}</p>
                    <p>Redirect URL: {currentUrl}/auth/oauth</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading || !currentUrl}>
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
