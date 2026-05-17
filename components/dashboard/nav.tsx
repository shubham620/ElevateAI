// components/dashboard/nav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Target,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  CheckCircle2,
} from "lucide-react"
import { useState } from "react"

export function DashboardNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const userRole = (session?.user as any)?.role

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard/employee",
      icon: Home,
      roles: ["EMPLOYEE", "MANAGER", "ADMIN"],
    },
    {
      title: "Goals",
      href: "/dashboard/goals",
      icon: Target,
      roles: ["EMPLOYEE"],
    },
    {
      title: "Check-ins",
      href: "/dashboard/checkins",
      icon: CheckCircle2,
      roles: ["EMPLOYEE", "MANAGER"],
    },
    {
      title: "Team Goals",
      href: "/dashboard/team-goals",
      icon: Target,
      roles: ["MANAGER"],
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      roles: ["EMPLOYEE", "MANAGER", "ADMIN"],
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
      roles: ["ADMIN"],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["EMPLOYEE", "MANAGER", "ADMIN"],
    },
  ]

  const visibleItems = navItems.filter(item =>
    item.roles.includes(userRole)
  )

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex w-64 flex-col bg-card border-r border-border">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white text-sm font-bold">
              E
            </div>
            <span>ElevateAI</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.title}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden fixed inset-0 z-40 bg-card/95 backdrop-blur pt-20 px-4">
          <div className="space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors block",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.title}
                </Link>
              )
            })}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 mt-4"
            onClick={() => {
              setIsOpen(false)
              signOut({ callbackUrl: "/auth/signin" })
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </nav>
      )}
    </>
  )
}
