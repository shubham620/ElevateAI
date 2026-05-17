// app/dashboard/analytics/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TrendingUp, Users, Target, CheckCircle2, AlertCircle } from "lucide-react"
import { apiGet } from "@/lib/api"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts"

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await apiGet("/api/dashboard")
      setStats(data.stats)
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setIsLoading(false)
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
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Organization-wide performance metrics and trends</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Goals</p>
                  <p className="text-3xl font-bold mt-2">{stats?.activeGoals || 0}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold mt-2">{stats?.completionRate || 0}%</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                  <p className="text-3xl font-bold mt-2">{stats?.atRiskCount || 0}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-3xl font-bold mt-2">{stats?.totalEmployees || 0}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Health Score</p>
                  <p className="text-3xl font-bold mt-2">{stats?.avgHealthScore || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Goal Status Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly goal completion tracking</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="completed" stackId="1" fill="#10b981" />
                  <Area type="monotone" dataKey="inProgress" stackId="1" fill="#3b82f6" />
                  <Area type="monotone" dataKey="atRisk" stackId="1" fill="#ef4444" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance vs Target</CardTitle>
            <p className="text-sm text-muted-foreground">Quarterly performance scores</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" name="Actual" />
                  <Bar dataKey="target" fill="#d1d5db" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <p className="text-sm text-muted-foreground">Performance scores by department</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentData.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold">{dept.name}</p>
                  <p className="text-xs text-muted-foreground">{dept.employees} team members</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-green-500" style={{ width: `${dept.score}%` }} />
                  </div>
                  <span className="w-14 text-center rounded-full px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-900">
                    {dept.score}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>✓ Team performance improved by 8% from Q3 to Q4</li>
            <li>✓ Design department leads with a 92 average health score</li>
            <li>✓ Goal completion increased from 72% (Q1) to 92% (Q4)</li>
            <li>✓ Risk level decreased to 3% - lowest in the fiscal year</li>
            <li>✓ Recommend focusing on cross-team alignment and ownership</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

const chartData = [
  { month: "Jan", completed: 40, inProgress: 60, atRisk: 10 },
  { month: "Feb", completed: 50, inProgress: 55, atRisk: 8 },
  { month: "Mar", completed: 65, inProgress: 45, atRisk: 6 },
  { month: "Apr", completed: 75, inProgress: 40, atRisk: 5 },
  { month: "May", completed: 85, inProgress: 35, atRisk: 4 },
  { month: "Jun", completed: 92, inProgress: 30, atRisk: 3 },
]

const performanceData = [
  { quarter: "Q1", score: 72, target: 85 },
  { quarter: "Q2", score: 78, target: 85 },
  { quarter: "Q3", score: 82, target: 85 },
  { quarter: "Q4", score: 88, target: 85 },
]

const departmentData = [
  { name: "Product", score: 88, employees: 15 },
  { name: "Engineering", score: 85, employees: 25 },
  { name: "Design", score: 92, employees: 8 },
  { name: "Sales", score: 78, employees: 12 },
  { name: "Marketing", score: 81, employees: 7 },
]
