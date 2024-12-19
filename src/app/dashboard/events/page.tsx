'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon } from 'lucide-react'
import { EventDetail } from "@/components/pages-event-id"

// Sample event data
const events = [
  {
    id: 1,
    title: "Mountain Trail Challenge",
    date: "2023-08-15",
    time: "07:00 AM",
    location: "Rocky Mountains, CO",
    participants: 150,
    difficulty: "Hard",
    description: "Experience the thrill of racing through challenging mountain trails. This event will test your endurance and skill in a beautiful alpine setting.",
    requirements: "Good physical condition, trail running experience, proper trail running shoes, and hydration pack.",
    schedule: [
      { time: "06:00 AM", activity: "Check-in opens" },
      { time: "06:45 AM", activity: "Pre-race briefing" },
      { time: "07:00 AM", activity: "Race starts" },
      { time: "03:00 PM", activity: "Cut-off time" },
      { time: "04:00 PM", activity: "Awards ceremony" },
    ]
  },
  {
    id: 2,
    title: "Coastal Adventure Race",
    date: "2023-09-01",
    time: "08:00 AM",
    location: "Pacific Coast, CA",
    participants: 100,
    difficulty: "Medium",
    description: "A scenic race along the beautiful Pacific coastline. Combines running, swimming, and navigation challenges.",
    requirements: "Swimming ability, wetsuit, running shoes, and basic navigation skills.",
    schedule: [
      { time: "07:00 AM", activity: "Registration" },
      { time: "07:45 AM", activity: "Safety briefing" },
      { time: "08:00 AM", activity: "Race begins" },
      { time: "02:00 PM", activity: "Course closes" },
      { time: "03:00 PM", activity: "Awards" },
    ]
  },
  {
    id: 3,
    title: "Urban Obstacle Course",
    date: "2023-09-15",
    time: "09:00 AM",
    location: "New York City, NY",
    participants: 200,
    difficulty: "Easy",
    description: "Navigate through an exciting urban obstacle course in the heart of NYC. Perfect for beginners!",
    requirements: "Basic fitness level, comfortable clothing, and running shoes.",
    schedule: [
      { time: "08:00 AM", activity: "Check-in" },
      { time: "08:45 AM", activity: "Course walkthrough" },
      { time: "09:00 AM", activity: "First wave starts" },
      { time: "02:00 PM", activity: "Last wave starts" },
      { time: "04:00 PM", activity: "Event concludes" },
    ]
  },
  {
    id: 4,
    title: "Desert Endurance Test",
    date: "2023-10-01",
    time: "06:00 AM",
    location: "Mojave Desert, NV",
    participants: 75,
    difficulty: "Extreme",
    description: "Push your limits in this challenging desert endurance event. Test your survival skills and stamina.",
    requirements: "Advanced endurance training, desert survival knowledge, specialized gear, and medical clearance.",
    schedule: [
      { time: "05:00 AM", activity: "Final gear check" },
      { time: "05:45 AM", activity: "Mandatory briefing" },
      { time: "06:00 AM", activity: "Race start" },
      { time: "06:00 PM", activity: "Cut-off time" },
      { time: "07:00 PM", activity: "Awards ceremony" },
    ]
  }
]

export default function EventsSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedEvent = events.find(event => event.id === selectedEventId)

  if (selectedEvent) {
    return (
      <EventDetail 
        event={selectedEvent} 
        onBack={() => setSelectedEventId(null)} 
      />
    )
  }

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
          <div 
            key={event.id} 
            className="cursor-pointer" 
            onClick={() => setSelectedEventId(event.id)}
          >
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
          </div>
        ))}
      </div>
    </div>
  )
}
