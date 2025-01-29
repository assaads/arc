import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

// Register for an event
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if event exists and is open for registration
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        registrations: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if registration is open
    if (event.registrationStatus !== 'open') {
      return NextResponse.json(
        { error: 'Registration is closed for this event' },
        { status: 400 }
      )
    }

    // Check if event is public or user has access
    if (!event.isPublic && event.createdById !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access to private event' },
        { status: 401 }
      )
    }

    // Check if user is already registered
    const existingRegistration = event.registrations.find(
      (reg: { userId: string }) => reg.userId === userId
    )
    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Already registered for this event' },
        { status: 400 }
      )
    }

    // Check if event is at capacity
    if (event.registrations.length >= event.capacity) {
      return NextResponse.json(
        { error: 'Event is at capacity' },
        { status: 400 }
      )
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        eventId: params.id,
        userId,
        status: 'confirmed'
      }
    })

    return NextResponse.json(registration)
  } catch (error) {
    console.error('Failed to register for event:', error)
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    )
  }
}

// Cancel registration
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find existing registration
    const registration = await prisma.registration.findFirst({
      where: {
        eventId: params.id,
        userId
      }
    })

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    // Delete registration
    await prisma.registration.delete({
      where: { id: registration.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to cancel registration:', error)
    return NextResponse.json(
      { error: 'Failed to cancel registration' },
      { status: 500 }
    )
  }
}
