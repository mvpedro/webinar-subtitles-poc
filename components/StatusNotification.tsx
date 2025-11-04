'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export function StatusNotification() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState<string | null>(null)
  const [type, setType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    const youtubeConnected = searchParams?.get('youtube_connected')
    const youtubeError = searchParams?.get('youtube_error')

    if (youtubeConnected === 'true') {
      setMessage('YouTube account linked successfully!')
      setType('success')
    } else if (youtubeError) {
      setMessage(`YouTube connection failed: ${decodeURIComponent(youtubeError)}`)
      setType('error')
    } else {
      setMessage(null)
    }

    // Clear message after 5 seconds
    if (youtubeConnected || youtubeError) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (!message) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'success'
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-medium">{message}</p>
        <button
          onClick={() => setMessage(null)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}

