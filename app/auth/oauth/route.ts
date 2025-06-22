import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const { searchParams, origin } = requestUrl
    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const error_description = searchParams.get("error_description")

    console.log("OAuth callback received:", {
      code: !!code,
      error,
      error_description,
      origin,
      fullUrl: request.url,
      headers: Object.fromEntries(request.headers.entries()),
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

    // Create the redirect response
    const redirectUrl = `https://negatron-seven.vercel.app/protected`
    console.log("Final redirect URL:", redirectUrl)

    const response = NextResponse.redirect(redirectUrl)

    // Ensure cookies are set properly
    response.headers.set("Cache-Control", "no-cache, no-store, max-age=0")

    return response
  } catch (err) {
    console.error("OAuth route error:", err)
    const { origin } = new URL(request.url)
    const errorMessage = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(errorMessage)}`)
  }
}
