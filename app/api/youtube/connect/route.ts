import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Week 4 - Implement YouTube OAuth flow
    // This should redirect to YouTube OAuth consent screen
    const youtubeClientId = process.env.YOUTUBE_CLIENT_ID
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/youtube/callback`
    const scope = 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube'

    if (!youtubeClientId) {
      return NextResponse.json(
        { error: 'YouTube OAuth not configured' },
        { status: 500 }
      )
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${youtubeClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${session.user?.id}`

    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('YouTube connect error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

