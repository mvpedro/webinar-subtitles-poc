import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('video') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file size (2GB max per PRD)
    const maxSize = 2 * 1024 * 1024 * 1024 // 2GB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 2GB limit' },
        { status: 400 }
      )
    }

    // TODO: Week 2 - Integrate with AWS Lambda via API Gateway
    // For now, return a placeholder response
    const apiGatewayEndpoint = process.env.API_GATEWAY_ENDPOINT

    if (!apiGatewayEndpoint) {
      return NextResponse.json(
        { error: 'API Gateway endpoint not configured' },
        { status: 500 }
      )
    }

    // Convert file to buffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Call AWS Lambda via API Gateway
    const response = await fetch(`${apiGatewayEndpoint}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
        'X-File-Name': file.name,
        'X-User-Id': session.user?.id || '',
        'X-User-Email': session.user?.email || '',
      },
      body: buffer,
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: error || 'Upload failed' },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      jobId: data.jobId,
      message: 'Video uploaded successfully',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

