// components/goals/goal-create-dialog.tsx
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
import { apiPost } from "@/lib/api"
import { Wand2 } from "lucide-react"

interface GoalCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function GoalCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: GoalCreateDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thrustArea: "",
    kpiType: "",
    target: "",
    weightage: "",
    deadline: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.target || !formData.weightage || !formData.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
      })
      return
    }

    setIsLoading(true)

    try {
      await apiPost("/api/goals", {
        ...formData,
        target: parseFloat(formData.target),
        weightage: parseFloat(formData.weightage),
      })

      toast({
        title: "Success",
        description: "Goal created successfully",
      })

      setFormData({
        title: "",
        description: "",
        thrustArea: "",
        kpiType: "",
        target: "",
        weightage: "",
        deadline: "",
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create goal",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIGenerate = async () => {
    if (!formData.description) {
      toast({
        title: "Error",
        description: "Please describe your goal first",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await apiPost("/api/ai/generate-goal", {
        input: formData.description,
      })

      setFormData(prev => ({
        ...prev,
        title: response.title || prev.title,
        description: response.description || prev.description,
        thrustArea: response.thrustArea || prev.thrustArea,
        kpiType: response.kpiType || prev.kpiType,
        target: response.target?.toString() || prev.target,
      }))

      toast({
        title: "Goal Generated",
        description: "AI has generated SMART goal suggestions",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate goal with AI",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
          <DialogDescription>
            Set a new goal to track your quarterly progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Goal Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you want to achieve..."
              className="min-h-20"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAIGenerate}
              disabled={isLoading}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate with AI
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="e.g., Increase Customer Satisfaction"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thrustArea">Thrust Area</Label>
              <Input
                id="thrustArea"
                placeholder="e.g., Customer Success"
                value={formData.thrustArea}
                onChange={(e) => setFormData({ ...formData, thrustArea: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kpiType">KPI Type</Label>
              <Input
                id="kpiType"
                placeholder="e.g., Satisfaction Score"
                value={formData.kpiType}
                onChange={(e) => setFormData({ ...formData, kpiType: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target Value</Label>
              <Input
                id="target"
                type="number"
                placeholder="e.g., 92"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weightage">Weightage (%)</Label>
              <Input
                id="weightage"
                type="number"
                placeholder="e.g., 30"
                min="10"
                max="100"
                value={formData.weightage}
                onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
