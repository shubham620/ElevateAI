// app/dashboard/goals/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Goal } from "@/types"
import { apiGet } from "@/lib/api"
import { cn, calculateProgress, formatDate, getDaysUntilDeadline, isOverdue } from "@/lib/utils"
import { GoalCreateDialog } from "@/components/goals/goal-create-dialog"
import { GoalEditDialog } from "@/components/goals/goal-edit-dialog"

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      const data = await apiGet("/api/goals")
      setGoals(data)
    } catch (error) {
      console.error("Failed to load goals", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoalCreated = () => {
    setShowCreateDialog(false)
    loadGoals()
  }

  const handleGoalUpdated = () => {
    setEditingGoal(null)
    loadGoals()
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Goals</h1>
          <p className="text-muted-foreground">Manage and track your quarterly goals</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.progress, goal.target)
          const daysLeft = getDaysUntilDeadline(goal.deadline)
          const overdue = isOverdue(goal.deadline)

          return (
            <Card key={goal.id} className="hover:border-primary transition-colors cursor-pointer" onClick={() => setEditingGoal(goal)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{goal.title}</CardTitle>
                  <Badge variant={goal.approvalStatus === "APPROVED" ? "success" : "warning"}>
                    {goal.approvalStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {goal.progress.toFixed(1)} / {goal.target}
                  </p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">KPI Type</p>
                    <p className="font-medium">{goal.kpiType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-medium">{goal.weightage}%</p>
                  </div>
                </div>

                {/* Deadline */}
                <div className={cn(
                  "text-sm p-2 rounded-md",
                  overdue ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                )}>
                  {overdue ? "⚠️ Overdue" : `📅 ${daysLeft} days remaining`}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any goals yet</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      {showCreateDialog && (
        <GoalCreateDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={handleGoalCreated}
        />
      )}

      {editingGoal && (
        <GoalEditDialog
          goal={editingGoal}
          open={!!editingGoal}
          onOpenChange={() => setEditingGoal(null)}
          onSuccess={handleGoalUpdated}
        />
      )}
    </div>
  )
}
