// components/checkins/checkin-create-dialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiPost } from "@/lib/api";
import { Goal } from "@/types";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Target } from "lucide-react";

interface CheckinCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal;
  quarter: string;
  onSuccess: () => void;
}

export function CheckinCreateDialog({
  open,
  onOpenChange,
  goal,
  quarter,
  onSuccess,
}: CheckinCreateDialogProps) {
  const { toast } = useToast();
  const [achievement, setAchievement] = useState("");
  const [status, setStatus] = useState<"NOT_STARTED" | "ON_TRACK" | "COMPLETED">("ON_TRACK");
  const [progress, setProgress] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!achievement.trim()) {
      toast({
        title: "Error",
        description: "Please describe your achievements",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiPost("/api/checkins", {
        goalId: goal.id,
        quarter,
        achievement,
        status,
        progress: parseInt(progress.toString()),
      });

      toast({
        title: "Success",
        description: `${quarter} check-in submitted successfully`,
      });

      setAchievement("");
      setStatus("ON_TRACK");
      setProgress(50);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit check-in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: "NOT_STARTED", label: "Not Started", color: "bg-slate-100 text-slate-800" },
    { value: "ON_TRACK", label: "On Track", color: "bg-blue-100 text-blue-800" },
    { value: "COMPLETED", label: "Completed", color: "bg-green-100 text-green-800" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            Submit Check-in
          </DialogTitle>
          <DialogDescription>
            Update your progress for <strong>{quarter}</strong>
          </DialogDescription>
        </DialogHeader>

        <motion.form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Goal</p>
                <p className="font-semibold text-gray-900 mt-1">{goal.title}</p>
                <p className="text-sm text-gray-600 mt-2">Target: {goal.target} {goal.kpiType}</p>
              </div>
              <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Label>Progress: {progress}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    status === value
                      ? "border-blue-600 " + color
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className={`text-sm font-medium ${status === value ? "" : "text-gray-700"}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Achievement Description */}
          <div className="space-y-2">
            <Label htmlFor="achievement">What have you accomplished?</Label>
            <Textarea
              id="achievement"
              placeholder="Describe your achievements, milestones reached, and progress made during this quarter..."
              value={achievement}
              onChange={(e) => setAchievement(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {achievement.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Submitting..." : "Submit Check-in"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
