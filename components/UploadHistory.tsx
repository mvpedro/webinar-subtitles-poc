'use client'

import { useEffect, useState } from 'react'

interface UploadJob {
  id: string
  videoName: string
  status: 'uploading' | 'transcribing' | 'translating' | 'uploading_to_youtube' | 'completed' | 'failed'
  createdAt: string
  youtubeUrl?: string
  error?: string
}

export function UploadHistory() {
  const [jobs, setJobs] = useState<UploadJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchJobs, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: UploadJob['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'uploading':
      case 'transcribing':
      case 'translating':
      case 'uploading_to_youtube':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return <div className="text-gray-600">Loading...</div>
  }

  if (jobs.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No uploads yet. Upload your first video to get started!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">{job.videoName}</h3>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(job.status)}`}
            >
              {job.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            {formatDate(job.createdAt)}
          </p>
          {job.youtubeUrl && (
            <a
              href={job.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View on YouTube →
            </a>
          )}
          {job.error && (
            <p className="text-sm text-red-600 mt-2">Error: {job.error}</p>
          )}
        </div>
      ))}
    </div>
  )
}

