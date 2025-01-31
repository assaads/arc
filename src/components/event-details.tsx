'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Schedule {
  time: string
  activity: string
}

interface Event {
  schedule?: Schedule[]
  id: string
  title: string
  date: string
  time: string
  location: string
  participants: number
  difficulty: string
  description: string
  requirements: string
  isPublic: boolean
  status: string
  registrationStatus: string
  createdAt: Date
  updatedAt: Date
  createdById: string
}

interface EventDetailsProps {
  event: Event
  isRegistered: boolean
}

export default function EventDetails({ event, isRegistered }: EventDetailsProps) {
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)

  const handleRegister = async () => {
    try {
      setIsRegistering(true)
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to register')
      }

      router.refresh()
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl mb-2 text-gray-800 font-bold">
              {event.title}
            </CardTitle>
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
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="details" className="text-sm sm:text-base">Details</TabsTrigger>
            <TabsTrigger value="requirements" className="text-sm sm:text-base">Requirements</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="text-sm sm:text-base md:text-lg text-gray-700">
            <p>{event.description}</p>
          </TabsContent>
          <TabsContent value="requirements" className="text-sm sm:text-base md:text-lg text-gray-700">
            <p>{event.requirements}</p>
          </TabsContent>
        </Tabs>
        <div className="mt-6 flex justify-end">
          <Button
            size="lg"
            onClick={handleRegister}
            disabled={isRegistering || event.registrationStatus === "closed"}
            className={cn(
              isRegistered && "bg-red-500 hover:bg-red-600"
            )}
          >
            {isRegistering ? 'Processing...' : isRegistered ? 'Unregister' : 'Register Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
