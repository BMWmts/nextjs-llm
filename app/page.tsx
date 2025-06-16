// app/page.tsx
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-800">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        {user ? (
          <div>
            <h2 className="text-2xl font-semibold">
              Welcome back,
              <br />
              <span className="mt-2 inline-block text-green-500">
                {user.email}
              </span>
            </h2>
            <form action="/auth/sign-out" method="post">
              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-300"
              >
                Logout
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold">Next.js + Supabase</h1>
            <p className="mt-2 text-lg text-gray-600">
              A sample project with Google Login.
            </p>
            <Link href="/auth/sign-in" passHref className="mt-8 w-full">
              <button className="w-full rounded-md bg-green-500 px-5 py-3 text-lg font-semibold text-white shadow-sm transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                Login with Google
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}