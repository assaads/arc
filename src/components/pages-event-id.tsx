'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, InfoIcon } from 'lucide-react'

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  difficulty: string;
  description: string;
  requirements: string;
  schedule: Array<{
    time: string;
    activity: string;
  }>;
}

interface EventDetailProps {
  event: Event;
  onBack: () => void;
}

export function EventDetail({ event, onBack }: EventDetailProps) {
  const [isRegistered, setIsRegistered] = useState(false)

  if (!event) {
    return <div className="text-center p-8">Event not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        ← Back to Events
      </Button>
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
