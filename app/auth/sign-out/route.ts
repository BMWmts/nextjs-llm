// app/auth/sign-out/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error(error)
    return NextResponse.redirect('/error')
  }

  // Redirect to the home page after sign out
  return NextResponse.redirect(new URL('/', request.url), {
    status: 302,
  })
}