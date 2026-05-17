// app/dashboard/layout.tsx
import { ReactNode } from "react"
import { getServerSession } from "next-auth/next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard/nav"
import { DashboardHeader } from "@/components/dashboard/header"
import { AiCopilotPanel } from "@/components/copilot/ai-copilot-panel"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(auth)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <DashboardNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* AI Copilot - Global */}
      <AiCopilotPanel 
        userId={session.user.id}
        userRole={session.user.role as "EMPLOYEE" | "MANAGER" | "ADMIN"}
      />
    </div>
  )
}
