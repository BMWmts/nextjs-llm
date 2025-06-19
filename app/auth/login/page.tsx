import { LoginForm } from '@/components/login-form'


export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* div สำหรับเนื้อหาหลัก (LoginForm) ที่จะอยู่ตรงกลางและขยายเต็มพื้นที่ที่เหลือ */}
      <div className="flex flex-grow items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>

      {/* div สำหรับ Foot ที่จะอยู่ชิดขอบล่าง */}
    </div>
  )
}