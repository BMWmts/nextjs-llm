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
    const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (authError) {
      console.error('Error exchanging code for session:', authError.message);
      // อาจจะ redirect ไปหน้า login พร้อมข้อความ error
      return NextResponse.redirect(`${origin}/auth/v1/callback?error=${encodeURIComponent(authError.message)}`);
    } else {
      console.log('Login successful, session updated.');
      // อาจจะ redirect ไปหน้า dashboard หรือหน้าอื่น ๆ ที่ต้องการ
      const user = authData.user;


      if(user) {
        console.log('User ID:', user.id);
        console.log('User Email:', user.email);
        console.log('User metadata:', user.user_metadata);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: user.id, 
            full_name: user.user_metadata.full_name, // ดึงจาก user_metadata
            avatar_url: user.user_metadata.avatar_url, // ดึงจาก user_metadata
          }, { onConflict: 'id' }) // ถ้า id ชนกันให้อัปเดต
          .select() // เลือกข้อมูลที่ upserted กลับมา

        if (profileError) {
          console.error('Error upserting profile:', profileError.message);
          // จัดการ error ในการบันทึก profile (อาจจะยังคง redirect ไปหน้า DashBoard)
        } else {
          console.log('User profile updated/created:', profile);
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}