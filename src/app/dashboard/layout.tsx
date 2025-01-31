import DashboardComponent from "./dashboard"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardComponent>{children}</DashboardComponent>
}
