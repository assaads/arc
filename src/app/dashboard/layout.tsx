import DashboardComponent from "./dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardComponent>{children}</DashboardComponent>;
}
