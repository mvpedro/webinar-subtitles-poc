// Shared types for the application

export interface UploadJob {
  id: string
  userId: string
  videoName: string
  s3Key: string
  status:
    | 'uploading'
    | 'transcribing'
    | 'translating'
    | 'uploading_to_youtube'
    | 'completed'
    | 'failed'
  createdAt: string
  updatedAt: string
  youtubeUrl?: string
  youtubeVideoId?: string
  error?: string
  subtitles?: {
    en?: string // S3 key for English subtitles
    'pt-BR'?: string // S3 key for Portuguese subtitles
    es?: string // S3 key for Spanish subtitles
  }
}

export interface YouTubeCredentials {
  accessToken: string
  refreshToken: string
  expiresAt: number
  userId: string
}

