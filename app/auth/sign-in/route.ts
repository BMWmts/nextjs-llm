import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const provider = 'google';
  const supabase = createClient();

  // Determine the origin URL (e.g., http://localhost:3000)
  const origin = request.nextUrl.origin;

  // This is the URL Google will redirect back to after authentication.
  // This MUST match the path of your callback route handler.
  const redirectTo = `${origin}/auth/v1/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error('Error initiating OAuth sign-in:', error);
    return NextResponse.redirect(new URL('/error', origin));
  }

  if (data.url) {
    // Redirect the user's browser to Google's authentication page
    return NextResponse.redirect(data.url);
  }

  console.error('OAuth sign-in initiated but no URL was returned.');
  return NextResponse.redirect(new URL('/error?message=OAuth_URL_Missing', origin));
}