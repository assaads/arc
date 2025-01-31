import { currentUser } from "@clerk/nextjs/server"

export const dynamic = 'force-dynamic'

export default async function HomeSection() {
  const user = await currentUser()
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.firstName || 'Adventurer'}!</h2>
      <p className="text-gray-600 mb-4">
        Here you can view your upcoming events, manage your profile, and explore new adventures.
      </p>
      <div className="grid gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Your Upcoming Events</h3>
          <p className="text-gray-500">No upcoming events. Browse available events to join the adventure!</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Browse upcoming events</li>
            <li>Update your profile</li>
            <li>View your event history</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
