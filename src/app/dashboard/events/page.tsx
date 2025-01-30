'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, Plus, Edit, Trash2, X } from 'lucide-react'
import EventForm, { EventFormData } from '@/components/event-form'

interface Registration {
  id: string
  userId: string
  status: string
  registrationDate: string
}

interface Event {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  location: string
  capacity: number
  difficultyLevel: string
  isPublic: boolean
  status: string
  registrationStatus: string
  registrations: Registration[]
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([])
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
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to delete event')
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
      alert('Failed to delete event')
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
    } catch (error) {
      console.error('Failed to save event:', error)
      alert('Failed to save event')
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
            startDate: editingEvent.startDate,
            endDate: editingEvent.endDate,
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
                <div className="flex items-center mt-1">
                  <MapPinIcon className="mr-2 h-4 w-4" />
                  {event.location}
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
