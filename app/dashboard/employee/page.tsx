// app/dashboard/employee/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Target, TrendingUp, AlertCircle, CheckCircle2, Zap } from "lucide-react"
import { apiGet } from "@/lib/api"
import { Goal } from "@/types"
import Link from "next/link"
import { ActivityFeed } from "@/components/activity-feed/activity-feed"
import { Analytics } from "@/components/analytics/charts"
import { HealthScoreBreakdown } from "@/components/dashboard/health-score-breakdown"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function EmployeeDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [healthScore, setHealthScore] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await apiGet("/api/dashboard")
        setStats(dashboardData.stats)
        setGoals(dashboardData.goals || [])

        const scoreData = await apiGet("/api/health-score")
        setHealthScore(scoreData)
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const calculateProgress = (progress: number, target: number) => {
    if (!target || target === 0) return 0
    return Math.min(100, Math.round((progress / target) * 100))
  }

  const getDaysUntilDeadline = (deadline?: string | Date) => {
    if (!deadline) return 0
    const due = typeof deadline === "string" ? new Date(deadline) : deadline
    const now = new Date()
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const isOverdue = (deadline?: string | Date) => {
    if (!deadline) return false
    return getDaysUntilDeadline(deadline) < 0
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
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <p className="text-muted-foreground mt-2">Track your goals, progress, and health score in one place.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Goals</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalGoals || 0}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold mt-2">{stats?.inProgressGoals || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
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
                <p className="text-sm text-muted-foreground">At Risk</p>
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
                <p className="text-sm text-muted-foreground">Focus Alerts</p>
                <p className="text-3xl font-bold mt-2">{stats?.alerts || 0}</p>
              </div>
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progress Trend</CardTitle>
            <CardDescription>Recent goal completion and momentum</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={goalProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Score</CardTitle>
            <CardDescription>Your current work health profile</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthScoreBreakdown
              score={healthScore?.score ?? 0}
              consistency={healthScore?.consistency}
              completion={healthScore?.completion}
              engagement={healthScore?.engagement}
              productivity={healthScore?.productivity}
              deadlineDiscipline={healthScore?.discipline}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Active Goals</CardTitle>
            <CardDescription>Performance, deadlines, and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.slice(0, 5).map((goal) => {
                const progress = calculateProgress(goal.progress, goal.target)
                const deadlineDays = getDaysUntilDeadline(goal.deadline)
                const overdue = isOverdue(goal.deadline)

                return (
                  <div key={goal.id} className="border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      </div>
                      <Badge variant={goal.status === "COMPLETED" ? "success" : "default"}>
                        {goal.status}
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{progress}% complete</span>
                        <span>{overdue ? "Overdue" : `${deadlineDays} days left`}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>Quick actions for this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Keep your most important goals in focus and update status weekly.</p>
            <Link href="/dashboard/goals">
              <Button>Manage Goals</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>All recent updates in your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed userId={session?.user?.id ?? ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Analytics</CardTitle>
            <CardDescription>Track your goal completion trends</CardDescription>
          </CardHeader>
          <CardContent>
            <Analytics />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const goalProgressData = [
  { name: "Week 1", progress: 42 },
  { name: "Week 2", progress: 56 },
  { name: "Week 3", progress: 74 },
  { name: "Week 4", progress: 88 },
]
