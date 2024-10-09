import { useState } from 'react'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, InfoIcon } from 'lucide-react'

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
    ]
  }
]

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = events.map(event => ({
    params: { id: event.id.toString() }
  }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const event = events.find(e => e.id === Number(params?.id))
  if (!event) {
    return { notFound: true }
  }
  return { props: { event } }
}

export default function EventPage({ event }) {
  const [isRegistered, setIsRegistered] = useState(false)

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
              <CardDescription className="text-lg">
                <div className="flex items-center mt-2">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {event.date}
                </div>
                <div className="flex items-center mt-1">
                  <ClockIcon className="mr-2 h-5 w-5" />
                  {event.time}
                </div>
                <div className="flex items-center mt-1">
                  <MapPinIcon className="mr-2 h-5 w-5" />
                  {event.location}
                </div>
                <div className="flex items-center mt-1">
                  <UsersIcon className="mr-2 h-5 w-5" />
                  {event.participants} participants
                </div>
              </CardDescription>
            </div>
            <Badge variant={
              event.difficulty === "Easy" ? "secondary" :
              event.difficulty === "Medium" ? "default" :
              event.difficulty === "Hard" ? "destructive" :
              "outline"
            } className="text-lg py-1 px-3">
              {event.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <p>{event.description}</p>
            </TabsContent>
            <TabsContent value="requirements" className="mt-4">
              <p>{event.requirements}</p>
            </TabsContent>
            <TabsContent value="schedule" className="mt-4">
              <ul>
                {event.schedule.map((item, index) => (
                  <li key={index} className="mb-2 flex items-start">
                    <InfoIcon className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span><strong>{item.time}</strong> - {item.activity}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            size="lg" 
            onClick={() => setIsRegistered(!isRegistered)}
          >
            {isRegistered ? 'Unregister' : 'Register Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}