'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, Plus, Edit, Trash2, X } from 'lucide-react'
import EventForm, { EventFormData } from '@/components/event-form'
import { useToast } from "@/components/ui/use-toast"

import type { Event, Registration } from "@prisma/client"

type EventWithRegistrations = Event & {
  registrations: Registration[]
}

export default function EventsSection() {
  const { toast } = useToast()
  const [events, setEvents] = useState<EventWithRegistrations[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch events:', error)
      setIsLoading(false)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEvents() // Refresh the events list
        toast({
          title: "Event deleted",
          description: "The event has been deleted successfully.",
        })
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          title: "Failed to delete event",
          description: error.message || "Something went wrong",
        })
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
      toast({
        variant: "destructive",
        title: "Failed to delete event",
        description: "Something went wrong",
      })
    }
  }

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const handleSubmit = async (formData: EventFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(
        editingEvent ? `/api/events/${editingEvent.id}` : '/api/events',
        {
          method: editingEvent ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
            status: editingEvent?.status || 'draft' // Default status for new events
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save event')
      }

      await fetchEvents()
      setShowForm(false)
      setEditingEvent(null)
      toast({
        title: editingEvent ? "Event updated" : "Event created",
        description: "Your event has been saved successfully.",
      })
    } catch (error) {
      console.error('Failed to save event:', error)
      toast({
        variant: "destructive",
        title: "Failed to save event",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEvent(null)
  }

  if (showForm || editingEvent) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            {editingEvent ? 'Edit Event' : 'Create Event'}
          </h2>
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <EventForm
          initialData={editingEvent ? {
            name: editingEvent.name,
            description: editingEvent.description,
            startDate: editingEvent.startDate.toISOString().slice(0, 16),
            endDate: editingEvent.endDate.toISOString().slice(0, 16),
            location: editingEvent.location,
            capacity: editingEvent.capacity,
            difficultyLevel: editingEvent.difficultyLevel,
            isPublic: editingEvent.isPublic,
            registrationStatus: editingEvent.registrationStatus,
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Event Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>
      
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
                <Badge variant={event.isPublic ? "default" : "outline"}>
                  {event.isPublic ? "Public" : "Private"}
                </Badge>
                <Badge variant={
                  event.registrationStatus === "open" ? "default" : "destructive"
                }>
                  {event.registrationStatus}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Capacity: {event.registrations.length}/{event.capacity}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingEvent(event)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDelete(event.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
