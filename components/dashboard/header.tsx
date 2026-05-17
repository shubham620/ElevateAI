// components/dashboard/header.tsx
"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Bell, User } from "lucide-react"

export function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">{session?.user?.name}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
