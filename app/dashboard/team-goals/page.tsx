"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiGet } from "@/lib/api"
import { Goal } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, Users, Target, CheckCircle2, AlertCircle } from "lucide-react"

export default function TeamGoalsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [teamGoals, setTeamGoals] = useState<Goal[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTeamGoals()
  }, [])

  const loadTeamGoals = async () => {
    setIsLoading(true)
    try {
      const dashboardData = await apiGet("/api/dashboard")
      setTeamGoals(dashboardData.goals || [])
      setTeamMembers(dashboardData.teamMembers || [])
    } catch (error) {
      console.error("Failed to load team goals", error)
      toast({ title: "Error", description: "Could not load team goals" })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusVariant = (status: string) => {
    if (status === "COMPLETED") return "success"
    if (status === "PENDING") return "warning"
    if (status === "AT_RISK" || status === "RISK") return "destructive"
    return "default"
  }

  if (!session?.user) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">You must be signed in to view this page.</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Goals</h1>
          <p className="text-muted-foreground mt-2">
            Review the goals for your direct reports and track approvals, progress, and risk.
          </p>
        </div>
        <Button variant="outline" onClick={loadTeamGoals}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Direct reports</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{teamMembers.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Goals</CardTitle>
            <CardDescription>All team goals</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{teamGoals.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
            <CardDescription>Needs approval</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {teamGoals.filter((goal) => goal.approvalStatus === "PENDING").length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>At Risk</CardTitle>
            <CardDescription>Goals approaching trouble</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {teamGoals.filter((goal) => goal.status === "IN_PROGRESS" && goal.approvalStatus === "PENDING").length}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goal List</CardTitle>
          <CardDescription>
            See the full team goal backlog with owner, progress, and approval state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : teamGoals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              No team goals found yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {teamGoals.map((goal) => (
                <Card key={goal.id} className="border hover:border-primary transition-colors">
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{goal.employee?.name || "Team member"}</p>
                        <h2 className="text-xl font-semibold">{goal.title}</h2>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge variant={getStatusVariant(goal.approvalStatus)}>
                          {goal.approvalStatus}
                        </Badge>
                        <Badge variant={getStatusVariant(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Target</p>
                        <p className="font-medium">{goal.target}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">{goal.progress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-medium">{goal.weightage}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deadline</p>
                        <p className="font-medium">{new Date(goal.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{goal.employee?.department ?? "No department"}</span>
                      <Button size="sm" variant="ghost" className="gap-2">
                        View details
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
