// components/goals/goal-edit-dialog.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { apiPatch, apiDelete } from "@/lib/api"
import { Goal } from "@/types"
import { calculateProgress } from "@/lib/utils"
import { Trash2 } from "lucide-react"

interface GoalEditDialogProps {
  goal: Goal
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function GoalEditDialog({
  goal,
  open,
  onOpenChange,
  onSuccess,
}: GoalEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: goal.title,
    description: goal.description,
    progress: goal.progress.toString(),
    target: goal.target.toString(),
  })

  const progress = calculateProgress(goal.progress, goal.target)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await apiPatch(`/api/goals/${goal.id}`, {
        ...formData,
        progress: parseFloat(formData.progress),
        target: parseFloat(formData.target),
      })

      toast({
        title: "Success",
        description: "Goal updated successfully",
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update goal",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this goal?")) return

    setIsLoading(true)

    try {
      await apiDelete(`/api/goals/${goal.id}`)

      toast({
        title: "Success",
        description: "Goal deleted successfully",
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete goal",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Update your goal details and track progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={goal.locked}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={goal.locked}
              className="min-h-24"
            />
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-3">
            <p className="font-semibold text-sm">Progress Tracking</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="progress">Current Progress</Label>
                <Input
                  id="progress"
                  type="number"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target Value</Label>
                <Input
                  id="target"
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  step="0.1"
                  disabled={goal.locked}
                />
              </div>
            </div>

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-2">Progress</p>
                <div className="w-full bg-background rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="font-bold text-lg">{progress}%</span>
            </div>
          </div>

          {goal.locked && (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-lg text-sm">
              ⚠️ This goal is locked. Contact your manager to unlock it for editing.
            </div>
          )}

          <div className="flex gap-2 justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || goal.locked}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
