import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPinIcon } from 'lucide-react'
import { prisma } from "@/lib/db"

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const user = await currentUser()
  if (!user) {
    redirect('/sign-in')
  }

  const [events, userRegistrations] = await Promise.all([
    prisma.event.findMany({
      where: {
        isPublic: true,
        registrationStatus: 'open'
      },
      include: {
        registrations: true
      },
      orderBy: {
        startDate: 'asc'
      }
    }),
    prisma.registration.findMany({
      where: {
        userId: user.id
      },
      select: {
        eventId: true
      }
    })
  ])

  const userRegisteredEventIds = new Set(userRegistrations.map(reg => reg.eventId))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Upcoming Events</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="h-full transition-shadow hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{event.name}</CardTitle>
              <CardDescription>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary">{event.difficultyLevel}</Badge>
                <Badge variant="outline">
                  {event.registrations.length}/{event.capacity} spots filled
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">{event.description}</p>
              <Button 
                className="w-full"
                variant={
                  userRegisteredEventIds.has(event.id)
                    ? "secondary"
                    : event.registrations.length >= event.capacity
                    ? "outline"
                    : "default"
                }
                disabled={event.registrations.length >= event.capacity || userRegisteredEventIds.has(event.id)}
              >
                {userRegisteredEventIds.has(event.id)
                  ? "Registered"
                  : event.registrations.length >= event.capacity
                  ? "Event Full"
                  : "Register Now"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
