import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/AuthForm', request.url))
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}