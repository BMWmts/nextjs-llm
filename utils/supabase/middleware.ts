// src/utils/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) { // <--- เปลี่ยนตรงนี้!
  // Create an unmodified response initially
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string) {
          // If the cookie is updated, update the request's cookies as well
          request.cookies.set(name, value);
          response = NextResponse.next({ // <--- สร้าง response ใหม่ทุกครั้งที่ cookie ถูก set
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(name, value);
        },
        remove(name: string) {
          request.cookies.delete(name);
          response = NextResponse.next({ // <--- สร้าง response ใหม่ทุกครั้งที่ cookie ถูก remove
            request: {
              headers: request.headers,
            },
          });
          response.cookies.delete(name);
        },
      },
    },
  );

  // Refresh session if expired - required for Server Components
  // and Public Route access. This call updates the cookies.
  await supabase.auth.getUser();

  return response; // <--- คืนค่า response ที่มีการจัดการ cookies แล้ว
}