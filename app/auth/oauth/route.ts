import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const error_description = searchParams.get("error_description")

    // Log for debugging
    console.log("OAuth callback received:", { code: !!code, error, error_description })

    // Handle OAuth errors
    if (error) {
      console.error("OAuth error:", error, error_description)
      return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error_description || error)}`)
    }

    // if "next" is in param, use it as the redirect URL
    let next = searchParams.get("next") ?? "/protected"
    if (!next.startsWith("/")) {
      // if "next" is not a relative URL, use the default
      next = "/protected"
    }

    if (code) {
      const supabase = await createClient()
      console.log("Exchanging code for session...")

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      console.log("Session exchange result:", {
        success: !!data.session,
        user: !!data.user,
        error: error?.message,
      })

      if (!error && data.session) {
        const forwardedHost = request.headers.get("x-forwarded-host")
        const isLocalEnv = process.env.NODE_ENV === "development"

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`)
        } else {
          return NextResponse.redirect(`${origin}${next}`)
        }
      } else {
        console.error("Session exchange failed:", error)
        return NextResponse.redirect(
          `${origin}/auth/error?error=${encodeURIComponent(error?.message || "Session exchange failed")}`,
        )
      }
    }

    // return the user to an error page with instructions
    console.log("No code provided, redirecting to error")
    return NextResponse.redirect(`${origin}/auth/error?error=no_code_provided`)
  } catch (err) {
    console.error("OAuth route error:", err)
    const { origin } = new URL(request.url)
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent("Internal server error")}`)
  }
}
