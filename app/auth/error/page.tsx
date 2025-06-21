import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams
  const error = params?.error

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <strong>Error:</strong> {decodeURIComponent(error)}
              </div>
            ) : (
              <p className="text-sm text-gray-600">An unspecified error occurred during authentication.</p>
            )}

            <div className="space-y-2 text-xs text-gray-500">
              <p>
                <strong>Common issues:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Google OAuth not configured in Supabase</li>
                <li>Incorrect redirect URLs</li>
                <li>Missing environment variables</li>
                <li>Supabase project not properly set up</li>
              </ul>
            </div>

            <div className="pt-4">
              <Link href="/auth/login">
                <Button className="w-full">Try Again</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
