"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { CalendarDays, Clock, Settings, ChevronLeft, ChevronRight } from "lucide-react";

const sidebarItems = [
  { name: "Events", icon: CalendarDays, href: "/dashboard/events" },
  { name: "History", icon: Clock, href: "/dashboard/history" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`bg-gray-100 h-full transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      <nav className="space-y-2 p-4">
        {sidebarItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant={pathname === item.href ? "default" : "ghost"}
              className={`w-full justify-start ${
                isExpanded ? "px-4" : "px-2"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {isExpanded && <span className="ml-2">{item.name}</span>}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}