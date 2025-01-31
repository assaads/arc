'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EventPasscodeForm() {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      // Fetch event ID based on passcode
      const response = await fetch(`/api/events?passcode=${passcode}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid passcode')
      }

      if (data.eventId) {
        router.push(`/event/${data.eventId}`)
      } else {
        setError('Invalid passcode. Please try again.')
      }
    } catch (error) {
      setError('Invalid passcode. Please try again.')
      console.error('Passcode lookup failed:', error)
    }
  }

  return (
    <Card className="w-full bg-white shadow-lg mt-6">
      <CardHeader className="p-4 sm:p-6 md:p-8">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl text-center">
          Enter Event Passcode
        </CardTitle>
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
  )
}
