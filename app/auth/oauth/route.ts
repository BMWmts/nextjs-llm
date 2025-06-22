import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const { searchParams, origin } = requestUrl
    
    // Determine the correct origin for redirects
    // Prioritize VERCEL_URL if available, otherwise use the request's origin
    const currentOrigin = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : origin;

    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const error_description = searchParams.get("error_description")

    console.log("OAuth callback received:", {
      code: !!code,
      error,
      error_description,
      origin: currentOrigin, // Use the determined origin for logging
      fullUrl: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    })

    // Handle OAuth errors
    if (error) {
      console.error("OAuth error:", error, error_description) // Log the error
      return NextResponse.redirect(`${currentOrigin}/auth/error?error=${encodeURIComponent(error_description || error)}`)
    }

    if (!code) {
      console.error("No authorization code provided")
      return NextResponse.redirect(`${currentOrigin}/auth/error?error=${encodeURIComponent("No authorization code provided")}`)
    }

    const supabase = await createClient()
    console.log("Exchanging code for session...")

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("Session exchange failed:", exchangeError)
      return NextResponse.redirect(`${currentOrigin}/auth/error?error=${encodeURIComponent(exchangeError.message)}`)
    }

    if (!data.session) {
      console.error("No session created")
      return NextResponse.redirect(`${currentOrigin}/auth/error?error=${encodeURIComponent("No session created")}`)
    }

    console.log("Session created successfully for user:", data.user?.email)

    // Create the redirect response
    const redirectUrl = `${currentOrigin}/protected`
    console.log("Final redirect URL:", redirectUrl)

    const response = NextResponse.redirect(redirectUrl)

    // Ensure cookies are set properly
    response.headers.set("Cache-Control", "no-cache, no-store, max-age=0")

    return response
  } catch (err) {
    console.error("OAuth route error:", err)
    // Use the determined origin for error redirects as well
    const fallbackOrigin = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : new URL(request.url).origin;
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.redirect(`${fallbackOrigin}/auth/error?error=${encodeURIComponent(errorMessage)}`);
  }
}
