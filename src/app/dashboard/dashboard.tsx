'use client'

import { useState } from 'react'
import { UserButton, ClerkProvider } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Home, Calendar, Settings, Menu, X } from 'lucide-react'
import HomeSection from '@/app/dashboard/home/page'
import EventsSection from '@/app/dashboard/events/page'
import SettingsSection from '@/app/dashboard/settings/page'

type Section = 'home' | 'events' | 'settings'

export default function DashboardComponent() {
  const [isSidenavOpen, setIsSidenavOpen] = useState(true)
  const [activeSection, setActiveSection] = useState<Section>('home')

  const toggleSidenav = () => setIsSidenavOpen(!isSidenavOpen)

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />
      case 'events':
        return <EventsSection />
      case 'settings':
        return <SettingsSection />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Sidenav */}
        <div
          className={`bg-white shadow-lg transition-all duration-300 ease-in-out h-screen sticky top-0 ${
            isSidenavOpen ? 'w-64' : 'w-0'
          }`}
        >
          {isSidenavOpen && (
            <nav className="flex flex-col p-4 space-y-4">
              <Button
                variant="ghost"
                className={`justify-start ${activeSection === 'home' ? 'bg-gray-200' : ''}`}
                onClick={() => setActiveSection('home')}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button
                variant="ghost"
                className={`justify-start ${activeSection === 'events' ? 'bg-gray-200' : ''}`}
                onClick={() => setActiveSection('events')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Events
              </Button>
              <Button
                variant="ghost"
                className={`justify-start ${activeSection === 'settings' ? 'bg-gray-200' : ''}`}
                onClick={() => setActiveSection('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col h-screen overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={toggleSidenav}>
              {isSidenavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <h1 className="text-2xl font-bold">Adventure Racing Club</h1>
            <ClerkProvider>
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
            </div>
            </ClerkProvider>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 relative">
            {renderContent()}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2"
              onClick={toggleSidenav}
            >
              {isSidenavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </main>
        </div>
    </div>
  )
}
