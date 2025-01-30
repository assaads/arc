'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { isAdmin } from '@/lib/roles'

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      if (!isLoaded) return
      if (!userId) {
        router.push('/sign-in')
        return
      }

      const adminStatus = await isAdmin()
      if (!adminStatus) {
        router.push('/')
      }
    }

    checkAdmin()
  }, [isLoaded, userId, router])

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <>{children}</>
}
