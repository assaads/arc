import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import EventDetails from '@/components/event-details'
import EventPasscodeForm from '@/components/event-passcode-form'
import { Skeleton } from '@/components/ui/skeleton'

export default async function EventPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  
  if (!userId) {
    notFound()
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        registrations: {
          where: { userId },
          select: { id: true }
        },
        _count: {
          select: {
            registrations: true
          }
        }
      }
    })

    if (!event) {
      notFound()
    }

    // Transform event data to match the component interface
    const transformedEvent = {
      ...event,
      title: event.name,
      date: event.startDate.toLocaleDateString(),
      time: event.startDate.toLocaleTimeString(),
      difficulty: event.difficultyLevel,
      participants: event._count.registrations,
      requirements: event.description
    }

    const isRegistered = event.registrations.length > 0

    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <EventDetails 
              event={transformedEvent} 
              isRegistered={isRegistered}
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[150px] mt-6" />}>
            <EventPasscodeForm />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch event:', error)
    notFound()
  }
}
