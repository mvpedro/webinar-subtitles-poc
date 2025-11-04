import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Multilingual Subtitle Publisher
          </h1>
          <p className="text-gray-600 mb-6">
            Upload videos and generate multilingual subtitles with automatic YouTube publishing.
          </p>
          <Link
            href="/api/auth/signin"
            className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Sign in with Google
          </Link>
        </div>
      </div>
    )
  }

  redirect('/dashboard')
}

