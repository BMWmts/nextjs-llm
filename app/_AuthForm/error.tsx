'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h2 className="text-4xl font-bold text-red-500">Something went wrong!</h2>
      <button className="w-full rounded-md bg-gray-600 px-5 py-3 text-lg font-semibold text-white shadow-sm transition hover:bg-gray-700"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}