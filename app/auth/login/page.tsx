"use client";
import React from "react";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js"; // Import SupabaseClient Type

const supabase: SupabaseClient = createClient();

const LoginPage = () => {
  const SignInWithOAuth = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/v1/callback`,
        },
      });
      // การเรียกใช้ signInWithOAuth จะเปิดหน้าต่างใหม่สำหรับการเข้าสู่ระบบ
    } catch (err) {
      // จัดการข้อผิดพลาดที่อาจเกิดขึ้นจากการเรียกใช้ Function
      console.error("Unexpected error:", err);
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
          <p className="mt-2 text-center text-sm text-gray-600">
            เลือกวิธีการเข้าสู่ระบบ
          </p>
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
