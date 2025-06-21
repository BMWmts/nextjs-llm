import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const error_description = searchParams.get("error_description")

    console.log("OAuth callback received:", {
      code: !!code,
      error,
      error_description,
      origin,
      url: request.url,
    })

    // Handle OAuth errors
    if (error) {
      console.error("OAuth error:", error, error_description)
      return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error_description || error)}`)
    }

    if (!code) {
      console.error("No authorization code provided")
      return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent("No authorization code provided")}`)
    }

    const supabase = await createClient()
    console.log("Exchanging code for session...")

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("Session exchange failed:", exchangeError)
      return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(exchangeError.message)}`)
    }

    if (!data.session) {
      console.error("No session created")
      return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent("No session created")}`)
    }

    console.log("Session created successfully for user:", data.user?.email)

    // Always redirect to /protected first, then user can navigate to chat
    const redirectUrl = `${origin}/protected`
    console.log("Redirecting to:", redirectUrl)

    return NextResponse.redirect(redirectUrl)
  } catch (err) {
    console.error("OAuth route error:", err)
    const { origin } = new URL(request.url)
    const errorMessage = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(errorMessage)}`)
  }
}
