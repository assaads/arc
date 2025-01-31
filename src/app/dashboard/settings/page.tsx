import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserButton } from "@clerk/nextjs"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Account Settings</h2>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
              <div>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-500">{user.emailAddresses[0].emailAddress}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Manage your profile, email preferences, and account settings through Clerk.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Coming soon: Customize your email notifications for event updates, reminders, and announcements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Coming soon: Control your privacy settings and manage how your information is shared within the Adventure Racing Club community.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
