"use client";
import React from "react";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

const LoginPage = () => {
  const supabase: SupabaseClient = createClient();

    const SignInWithOAuth = async () => {
    console.log("SignInWithOAuth function called.");
    console.log("Redirect URL:", `${window.location.origin}/auth/v1/callback`); // <-- เพิ่มตรงนี้เพื่อยืนยัน URL

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ // <-- เพิ่ม data เข้ามาด้วย
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/v1/callback`,
        },
      });

      if (error) {
        console.error("Error from signInWithOAuth:", error.message); // <-- เปลี่ยนข้อความ error
        alert("Login failed: " + error.message);
      } else {
        console.log("signInWithOAuth successful, data:", data); // <-- ดูข้อมูลที่ส่งกลับมา
        // ตรงนี้ไม่มีการ redirect เกิดขึ้นทันทีในโค้ดฝั่ง client
        // Supabase จะจัดการการ redirect ไป Google โดยตรง
        // และถ้าสำเร็จ Google จะ redirect กลับมาที่ /auth/v1/callback
      }
    } catch (err) {
      console.error("Unexpected error during OAuth process:", err); // <-- เปลี่ยนข้อความ error
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            เข้าสู่ระบบ
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={SignInWithOAuth}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
