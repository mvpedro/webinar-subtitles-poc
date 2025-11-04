import { NextRequest, NextResponse } from 'next/server'

// TODO: Week 4 - Implement YouTube PubSub webhook handler
// This endpoint will receive push notifications from YouTube
// when video upload status changes

export async function POST(request: NextRequest) {
  try {
    // Verify webhook authenticity (YouTube sends specific headers)
    const headers = request.headers
    const xGoogChannelId = headers.get('x-goog-channel-id')
    const xGoogChannelToken = headers.get('x-goog-channel-token')

    // TODO: Verify token matches expected value

    const body = await request.json()

    // TODO: Process webhook payload and update DynamoDB
    // YouTube sends notifications about video status changes

    console.log('YouTube webhook received:', {
      channelId: xGoogChannelId,
      body,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for webhook verification (YouTube PubSub requirement)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const hubChallenge = searchParams.get('hub.challenge')
  const hubMode = searchParams.get('hub.mode')

  // YouTube PubSub verification
  if (hubMode === 'subscribe' && hubChallenge) {
    return new NextResponse(hubChallenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}

