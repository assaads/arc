'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, InfoIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Sample event data (in a real app, this would come from an API or database)
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
    ],
    passcode: "MNTC"
  },
  {
    id: 2,
    title: "City Marathon",
    date: "2023-09-10",
    time: "06:00 AM",
    location: "Downtown Metro",
    participants: 5000,
    difficulty: "Medium",
    description: "Join thousands of runners in this exciting urban marathon through the heart of the city.",
    requirements: "Good cardiovascular fitness, comfortable running shoes, and proper hydration.",
    schedule: [
      { time: "05:00 AM", activity: "Check-in opens" },
      { time: "05:45 AM", activity: "Pre-race warm-up" },
      { time: "06:00 AM", activity: "Race starts" },
      { time: "12:00 PM", activity: "Cut-off time" },
      { time: "01:00 PM", activity: "Awards ceremony" },
    ],
    passcode: "CMAR"
  },
]

export default function EventPage() {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  // Find the event based on the id from the URL
  const event = events.find(e => e.id === Number(1))

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetEvent = events.find(e => e.passcode === passcode)
    if (targetEvent) {
      router.push(`/event?id=${targetEvent.id}`)
    } else {
      setError('Invalid passcode. Please try again.')
    }
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">Event not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <Card className="w-full bg-white shadow-lg">
          <CardHeader className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl mb-2 text-gray-800 font-bold">{event.title}</CardTitle>
                <CardDescription className="text-sm sm:text-base md:text-lg text-gray-600 space-y-2">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{event.participants} participants</span>
                  </div>
                </CardDescription>
              </div>
              <Badge variant={
                event.difficulty === "Easy" ? "secondary" :
                event.difficulty === "Medium" ? "default" :
                event.difficulty === "Hard" ? "destructive" :
                "outline"
              } className="text-sm sm:text-base py-1 px-2 sm:px-3">
                {event.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="details" className="text-sm sm:text-base">Details</TabsTrigger>
                <TabsTrigger value="requirements" className="text-sm sm:text-base">Requirements</TabsTrigger>
                <TabsTrigger value="schedule" className="text-sm sm:text-base">Schedule</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="text-sm sm:text-base md:text-lg text-gray-700">
                <p>{event.description}</p>
              </TabsContent>
              <TabsContent value="requirements" className="text-sm sm:text-base md:text-lg text-gray-700">
                <p>{event.requirements}</p>
              </TabsContent>
              <TabsContent value="schedule" className="text-sm sm:text-base md:text-lg">
                <ul className="space-y-2">
                  {event.schedule.map((item, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <InfoIcon className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span><strong>{item.time}</strong> - {item.activity}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="w-full bg-white shadow-lg mt-6">
          <CardHeader className="p-4 sm:p-6 md:p-8">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl text-center">Enter Event Passcode</CardTitle>
            <CardDescription className="text-sm sm:text-base md:text-lg text-center mt-2">
              Enter a 4-letter passcode to be redirected to your event.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handlePasscodeSubmit} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="text"
                placeholder="Enter 4-letter passcode"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value.toUpperCase())
                  setError('')
                }}
                maxLength={4}
                className="text-center text-lg sm:text-xl flex-grow"
              />
              <Button type="submit" className="w-full sm:w-auto">
                Go to Event
              </Button>
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}