import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard?youtube_error=${encodeURIComponent(error)}`, request.url)
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard?youtube_error=no_code', request.url)
      )
    }

    // TODO: Week 4 - Exchange code for tokens and store securely
    // Exchange authorization code for access token
    const youtubeClientId = process.env.YOUTUBE_CLIENT_ID
    const youtubeClientSecret = process.env.YOUTUBE_CLIENT_SECRET
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/youtube/callback`

    if (!youtubeClientId || !youtubeClientSecret) {
      return NextResponse.redirect(
        new URL('/dashboard?youtube_error=not_configured', request.url)
      )
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: youtubeClientId,
        client_secret: youtubeClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      return NextResponse.redirect(
        new URL('/dashboard?youtube_error=token_exchange_failed', request.url)
      )
    }

    const tokens = await tokenResponse.json()

    // TODO: Store tokens securely (AWS Secrets Manager or encrypted in DynamoDB)
    // For now, we'll just redirect with success
    // In production, store tokens associated with the user ID

    return NextResponse.redirect(
      new URL('/dashboard?youtube_connected=true', request.url)
    )
  } catch (error) {
    console.error('YouTube callback error:', error)
    return NextResponse.redirect(
      new URL('/dashboard?youtube_error=internal_error', request.url)
    )
  }
}

