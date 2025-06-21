"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/buttonna"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Starting OAuth login...")

      // Get the correct redirect URL based on environment
      const getRedirectUrl = () => {
        if (typeof window !== "undefined") {
          // Client-side: use current origin
          return window.location.origin
        }
        // Fallback (shouldn't happen in client component)
        return process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_SITE_URL || "https://your-app.vercel.app"
          : "http://localhost:3000"
      }

      const redirectUrl = getRedirectUrl()
      console.log("Using redirect URL:", redirectUrl)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectUrl}/auth/oauth?next=/protected`,
          queryParams: {
            access_type: "offline",
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
                      <p>Current URL: {typeof window !== "undefined" ? window.location.origin : "N/A"}</p>
                      <p>Check Supabase OAuth settings</p>
                    </details>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </Button>
                <div className="text-xs text-gray-500 text-center">
                  <p>Make sure your Supabase OAuth redirect URLs include:</p>
                  <ul className="mt-1 space-y-1 text-left">
                    <li>• https://your-domain.vercel.app/auth/oauth</li>
                    <li>• http://localhost:3000/auth/oauth (for dev)</li>
                  </ul>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
