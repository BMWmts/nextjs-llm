// app/auth/callback/route.ts

import { createClient } from '@/utils/supabase/server' // ต้องใช้ client แบบ server
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers' // สำหรับ App Router ต้องใช้ cookies จาก next/headers

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore) // สร้าง Supabase client แบบ server
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error.message);
      // อาจจะ redirect ไปหน้า login พร้อมข้อความ error
      return NextResponse.redirect(`${origin}/auth/v1/callback?error=${encodeURIComponent(error.message)}`);
    } else {
      console.log('Login successful, session updated.');
      // อาจจะ redirect ไปหน้า dashboard หรือหน้าอื่น ๆ ที่ต้องการ
    }
  }

  // Redirect ไปยังหน้าหลักหรือหน้าที่คุณต้องการหลังจาก Login สำเร็จ
  // มักจะเป็นหน้า Dashboard หรือหน้า Home
  return NextResponse.redirect(`${origin}/Components/dashboard`); // หรือ `return NextResponse.redirect(`${origin}/dashboard`);`
}
