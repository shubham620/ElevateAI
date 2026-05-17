// app/dashboard/manager/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Target, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { apiGet, apiPost } from "@/lib/api"
import { Goal } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { ManagerApprovalPanel } from "@/components/goals/manager-approval-panel"
import { ActivityFeed } from "@/components/activity-feed/activity-feed"
import { Analytics } from "@/components/analytics/charts"

export default function ManagerDashboard() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [stats, setStats] = useState<any>(null)
  const [pendingGoals, setPendingGoals] = useState<Goal[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [selectedApproval, setSelectedApproval] = useState<Goal | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await apiGet("/api/dashboard")
        setStats(dashboardData.stats)
        setTeamMembers(dashboardData.teamMembers || [])
        const allGoals = dashboardData.goals || []
        setPendingGoals(allGoals.filter((goal: Goal) => goal.approvalStatus === "PENDING"))
      } catch (error) {
        console.error("Failed to load manager dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const refresh = async () => {
    setIsLoading(true)
    await loadData()
  }

  const loadData = async () => {
    try {
      const dashboardData = await apiGet("/api/dashboard")
      setStats(dashboardData.stats)
      setTeamMembers(dashboardData.teamMembers || [])
      const allGoals = dashboardData.goals || []
      setPendingGoals(allGoals.filter((goal: Goal) => goal.approvalStatus === "PENDING"))
    } catch (error) {
      console.error("Failed to reload manager dashboard data", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (goalId: string, comments: string) => {
    try {
      await apiPost(`/api/goals/${goalId}/approve`, { approved: true, comments })
      toast({ title: "Success", description: "Goal approved successfully" })
      setSelectedApproval(null)
      await refresh()
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve goal", variant: "destructive" })
    }
  }

  const handleReject = async (goalId: string, reason: string) => {
    try {
      await apiPost(`/api/goals/${goalId}/approve`, { approved: false, comments: reason })
      toast({ title: "Success", description: "Goal rejected and employee notified" })
      setSelectedApproval(null)
      await refresh()
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject goal", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="text-muted-foreground mt-2">Review approvals, monitor team health, and stay ahead of risk.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-3xl font-bold mt-2">{pendingGoals.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-3xl font-bold mt-2">{teamMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Goals</p>
                <p className="text-3xl font-bold mt-2">{stats?.completedGoals || 0}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At Risk Goals</p>
                <p className="text-3xl font-bold mt-2">{stats?.atRiskGoals || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Health</p>
                <p className="text-3xl font-bold mt-2">{stats?.avgHealthScore || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Pending Goal Approvals</CardTitle>
            <CardDescription>Review and approve the latest goals from your team</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingGoals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items pending approval right now.</p>
            ) : (
              <div className="space-y-4">
                {pendingGoals.map((goal) => (
                  <div key={goal.id} className="border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{goal.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
                      </div>
                      <Badge variant={goal.approvalStatus === "PENDING" ? "warning" : "default"}>
                        {goal.approvalStatus}
                      </Badge>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => setSelectedApproval(goal)}>
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Health Summary</CardTitle>
            <CardDescription>Track high performers and risk signals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.department || "Team member"}</p>
                    </div>
                    <Badge variant={member.healthScore >= 80 ? "success" : member.healthScore >= 60 ? "default" : "destructive"}>
                      {member.healthScore || 0}/100
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedApproval && (
        <ManagerApprovalPanel
          goal={selectedApproval}
          onApprove={(comments: string) => handleApprove(selectedApproval.id, comments)}
          onReject={(reason: string) => handleReject(selectedApproval.id, reason)}
          onClose={() => setSelectedApproval(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Team actions and goal updates</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed userId={session?.user?.id ?? ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manager Analytics</CardTitle>
            <CardDescription>Performance trends and risks</CardDescription>
          </CardHeader>
          <CardContent>
            <Analytics />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
