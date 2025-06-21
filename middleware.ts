import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Add some logging to debug middleware
  console.log("Middleware running for:", request.nextUrl.pathname)

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/oauth (OAuth callback)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|auth/oauth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
