'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon } from 'lucide-react'
import Link from 'next/link'

// Sample event data
const events = [
  {
    id: "1",
    title: "Mountain Trail Challenge",
    location: "Rocky Mountains, CO",
    difficulty: "Hard",
  },
  {
    id: 2,
    title: "Coastal Adventure Race",
    location: "Pacific Coast, CA",
    difficulty: "Medium",
  },
  {
    id: 3,
    title: "Urban Obstacle Course",
    location: "New York City, NY",
    difficulty: "Easy",
  },
  {
    id: 4,
    title: "Desert Endurance Test",
    location: "Mojave Desert, NV",
    difficulty: "Extreme",
  },
]

export default function EventsSection() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Link href={`/event/${event.id}`} key={event.id} className="block">
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription>
                  <div className="flex items-center mt-1">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={
                  event.difficulty === "Easy" ? "secondary" :
                  event.difficulty === "Medium" ? "default" :
                  event.difficulty === "Hard" ? "destructive" :
                  "outline"
                }>
                  {event.difficulty}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
