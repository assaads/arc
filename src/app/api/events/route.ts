import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { isAdmin } from "@/lib/roles"

export async function POST(request: NextRequest) {
  const authResult = await auth()
  if (!authResult.userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  try {
    const isAdminUser = await isAdmin()
    if (!isAdminUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const eventData = await request.json()
    const event = await prisma.event.create({
      data: {
        ...eventData,
        createdById: authResult.userId,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("Failed to create event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const isAdminUser = await isAdmin()
    const authResult = await auth()
    if (!authResult.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    let events
    if (isAdminUser) {
      // Admins can see all events
      events = await prisma.event.findMany({
        include: {
          registrations: true,
        },
        orderBy: {
          startDate: 'asc',
        },
      })
    } else {
      // Regular users can only see public events or events they're registered for
      events = await prisma.event.findMany({
        where: {
          OR: [
            { isPublic: true },
            {
              registrations: {
                some: {
                  userId: authResult.userId, // Now we know userId is not null
                },
              },
            },
          ],
        },
        include: {
          registrations: true,
        },
        orderBy: {
          startDate: 'asc',
        },
      })
    }

    return NextResponse.json(events)
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
