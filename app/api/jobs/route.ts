import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Week 4 - Fetch from DynamoDB via API Gateway
    // For now, return empty array
    const apiGatewayEndpoint = process.env.API_GATEWAY_ENDPOINT

    if (!apiGatewayEndpoint) {
      return NextResponse.json({ jobs: [] })
    }

    try {
      const response = await fetch(
        `${apiGatewayEndpoint}/jobs?userId=${session.user?.id}`,
        {
          method: 'GET',
          headers: {
            'X-User-Id': session.user?.id || '',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({ jobs: data.jobs || [] })
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }

    // Return empty array if API not available yet
    return NextResponse.json({ jobs: [] })
  } catch (error) {
    console.error('Jobs API error:', error)
    return NextResponse.json({ jobs: [] })
  }
}

