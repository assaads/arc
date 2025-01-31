import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await auth()
  if (!authResult.userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    // Check if event exists and registration is open
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        registrations: true,
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Check if registration is open
    if (event.registrationStatus !== "open") {
      return NextResponse.json(
        { error: "Registration is closed for this event" },
        { status: 400 }
      )
    }

    // Check if event is private and user has access
    if (!event.isPublic) {
      return NextResponse.json(
        { error: "This event is private" },
        { status: 401 }
      )
    }

    // Check if event is at capacity
    if (event.registrations.length >= event.capacity) {
      return NextResponse.json(
        { error: "Event is at capacity" },
        { status: 400 }
      )
    }

    // Check if user is already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId: params.id,
        userId: authResult.userId,
      },
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      )
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        userId: authResult.userId,
        eventId: params.id,
        status: "registered",
        registrationDate: new Date().toISOString(),
      },
    })

    return NextResponse.json(registration)
  } catch (error) {
    console.error("Failed to register for event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await auth()
  if (!authResult.userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    // Check if registration exists
    const registration = await prisma.registration.findFirst({
      where: {
        eventId: params.id,
        userId: authResult.userId,
      },
    })

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      )
    }

    // Delete registration
    await prisma.registration.delete({
      where: {
        id: registration.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to cancel registration:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
