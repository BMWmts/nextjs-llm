// app/auth/sign-in/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams:{}, origin } = new URL(request.url)
  const provider = 'google' // Hardcoded for this example

  if (provider) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error)
      return NextResponse.redirect('/error') // Redirect to an error page
    }

    if (data.url) {
      return NextResponse.redirect(data.url) // Redirect to Google's auth page
    }
  }

  return NextResponse.redirect('/error')
}