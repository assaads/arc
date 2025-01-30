import DashboardComponent from "./dashboard"
import ProtectedAdminLayout from "@/components/protected-admin-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedAdminLayout>
      <DashboardComponent>{children}</DashboardComponent>
    </ProtectedAdminLayout>
  )
}
