import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

// Get all events (filtered by access)
export async function GET() {
  try {
    const { userId } = await auth()
    
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { isPublic: true },
          { createdById: userId }
        ]
      },
      include: {
        registrations: true
      },
      orderBy: {
        startDate: 'asc'
      }
    })
    
    return NextResponse.json(events)
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// Create new event (admin only)
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const event = await prisma.event.create({
      data: {
        ...data,
        createdById: userId,
      }
    })
    
    return NextResponse.json(event)
  } catch (error) {
    console.error('Failed to create event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
