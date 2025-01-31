import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"
import { isAdmin } from "@/lib/roles"

export async function PATCH(
  request: NextRequest,
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
    const isAdminUser = await isAdmin()
    if (!isAdminUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const eventData = await request.json()
    const event = await prisma.event.update({
      where: { id: params.id },
      data: eventData,
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("Failed to update event:", error)
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
    const isAdminUser = await isAdmin()
    if (!isAdminUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await prisma.event.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
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
    const isAdminUser = await isAdmin()
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

    // Check access permissions
    if (!isAdminUser && !event.isPublic && !event.registrations.some(r => r.userId === authResult.userId)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Failed to fetch event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
