// components/checkins/checkin-review-panel.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiPost } from "@/lib/api";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquareText, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Checkin {
  id: string;
  goalId: string;
  quarter: string;
  achievement: string;
  progress: number;
  status: string;
  managerComment?: string;
  createdAt: Date;
  goal: {
    title: string;
    target: number;
    kpiType: string;
  };
  user: {
    name: string;
    email: string;
  };
}

interface CheckinReviewPanelProps {
  checkin: Checkin;
  onReviewComplete: () => void;
}

export function CheckinReviewPanel({ checkin, onReviewComplete }: CheckinReviewPanelProps) {
  const { toast } = useToast();
  const [comment, setComment] = useState(checkin.managerComment || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please add feedback before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiPost(`/api/checkins/${checkin.id}`, {
        managerComment: comment,
        status: "REVIEWED",
      });

      toast({
        title: "Success",
        description: "Check-in review submitted",
      });

      onReviewComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "ON_TRACK":
        return "bg-blue-100 text-blue-800";
      case "NOT_STARTED":
        return "bg-slate-100 text-slate-800";
      case "AT_RISK":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Check-in Review
              </CardTitle>
              <CardDescription className="mt-2">
                <strong>{checkin.user.name}</strong> submitted {checkin.quarter} check-in for{" "}
                <strong>{checkin.goal.title}</strong>
              </CardDescription>
            </div>
            <Badge className={getStatusColor(checkin.status)}>{checkin.status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Employee Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Employee</p>
              <p className="font-semibold text-gray-900">{checkin.user.name}</p>
              <p className="text-xs text-gray-600">{checkin.user.email}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Progress</p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-2xl font-bold text-blue-600">{checkin.progress}%</p>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${checkin.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Achievement */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Achievement Summary</p>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-gray-800 text-sm leading-relaxed">{checkin.achievement}</p>
            </div>
          </div>

          {/* Target vs Progress */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600">Target</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {checkin.goal.target}
                  <span className="text-xs text-gray-600 ml-1">{checkin.goal.kpiType}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Estimated Achievement</p>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {Math.round((checkin.progress / 100) * checkin.goal.target)}
                  <span className="text-xs text-gray-600 ml-1">{checkin.goal.kpiType}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Submitted</p>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDistanceToNow(new Date(checkin.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>

          {/* Existing Comment */}
          {checkin.managerComment && (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Previous Feedback</p>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-xs text-yellow-700 font-semibold mb-1">Manager Comment</p>
                <p className="text-sm text-gray-800">{checkin.managerComment}</p>
              </div>
            </div>
          )}

          {/* Manager Feedback */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <MessageSquareText className="w-4 h-4 text-gray-600" />
              Your Feedback
            </label>
            <Textarea
              placeholder="Provide constructive feedback on their progress, achievements, and next steps..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">{comment.length}/1000 characters</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Save for Later
            </Button>
            <Button
              className="flex-1"
              disabled={isLoading || !comment.trim()}
              onClick={handleSubmitReview}
            >
              {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              Submit Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
