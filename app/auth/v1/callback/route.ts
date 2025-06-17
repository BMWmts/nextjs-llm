import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  // if "next" is in param, use it as the redirect URL
  // Validate 'next' parameter to prevent open redirect vulnerabilities
  let next = requestUrl.searchParams.get('next') ?? '/'
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('..')) {
    next = '/'
  }

  if (code) {
    const supabase = createClient() // Assuming createClient() is synchronous
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successfully exchanged code for session.
      // The session cookie should now be set by Supabase.
      // Redirect to the intended page.
      return NextResponse.redirect(`${origin}${next}`)
    }

    // Error exchanging code for session
    console.error('Error exchanging code for session:', error)
    return NextResponse.redirect(`${origin}/error?message=auth_callback_error&details=${encodeURIComponent(error.message)}`)
  }

  // No code found in the request
  console.warn('No code found in auth callback request.')
  return NextResponse.redirect(`${origin}/error?message=auth_callback_missing_code`)
}