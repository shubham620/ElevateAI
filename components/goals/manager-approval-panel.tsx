// components/goals/manager-approval-panel.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, MessageSquare, Target } from "lucide-react";

interface ApprovalPanelProps {
  goal: any;
  onApprove: (comments: string) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onModify?: (updates: { target?: number; weightage?: number }) => Promise<void>;
  onClose?: () => void;
  isLoading?: boolean;
}

export function ManagerApprovalPanel({
  goal,
  onApprove,
  onReject,
  onModify,
  onClose,
  isLoading = false,
}: ApprovalPanelProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<"view" | "edit" | "comment">("view");
  const [comments, setComments] = useState("");
  const [reason, setReason] = useState("");
  const [editedTarget, setEditedTarget] = useState(goal.target.toString());
  const [editedWeightage, setEditedWeightage] = useState(goal.weightage.toString());
  const [submitting, setSubmitting] = useState(false);

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      await onApprove(comments);
      toast({
        title: "Goal Approved",
        description: `"${goal.title}" has been approved successfully`,
      });
      setMode("view");
      setComments("");
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve goal",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await onReject(reason);
      toast({
        title: "Goal Rejected",
        description: "Employee will be notified",
      });
      setMode("view");
      setReason("");
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject goal",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleModify = async () => {
    const target = editedTarget !== goal.target.toString() ? parseFloat(editedTarget) : undefined;
    const weightage = editedWeightage !== goal.weightage.toString() ? parseFloat(editedWeightage) : undefined;

    if (!target && !weightage) {
      toast({
        title: "No Changes",
        description: "Please modify at least one field",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (onModify) await onModify({ target, weightage });
      toast({
        title: "Goal Modified",
        description: "Changes have been saved",
      });
      setMode("view");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to modify goal",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-4"
    >
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-transparent p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {goal.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Submitted by {goal.employee?.name ?? "Unknown"}
              </p>
            </div>
            <Badge
              variant={
                goal.approvalStatus === "PENDING"
                  ? "outline"
                  : goal.approvalStatus === "APPROVED"
                    ? "default"
                    : "destructive"
              }
            >
              {goal.approvalStatus}
            </Badge>
          </div>
          <p className="text-sm text-gray-700">{goal.description}</p>
        </div>

        {/* Goal Details Grid */}
        <AnimatePresence>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600">
                Target
              </Label>
              {mode === "edit" ? (
                <Input
                  type="number"
                  value={editedTarget}
                  onChange={(e) => setEditedTarget(e.target.value)}
                  className="h-9"
                />
              ) : (
                <p className="flex items-center text-lg font-semibold text-gray-900">
                  <Target className="mr-2 h-4 w-4" />
                  {goal.target} {goal.kpiType}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600">
                Weightage
              </Label>
              {mode === "edit" ? (
                <Input
                  type="number"
                  value={editedWeightage}
                  onChange={(e) => setEditedWeightage(e.target.value)}
                  min="10"
                  max="100"
                  className="h-9"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  {goal.weightage}%
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600">
                KPI Type
              </Label>
              <p className="text-sm text-gray-700">{goal.kpiType}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600">
                Deadline
              </Label>
              <p className="text-sm text-gray-700">
                {new Date(goal.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </AnimatePresence>

        {/* Action Buttons */}
        {goal.approvalStatus === "PENDING" && (
          <div className="mt-6 flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setMode(mode === "view" ? "comment" : "view")}
                variant="outline"
                size="sm"
                disabled={submitting}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {mode === "comment" ? "Cancel" : "Add Comment"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setMode(mode === "view" ? "edit" : "view")}
                variant="outline"
                size="sm"
                disabled={submitting}
              >
                <Target className="mr-2 h-4 w-4" />
                {mode === "edit" ? "Cancel" : "Modify"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleApprove}
                variant="default"
                size="sm"
                disabled={submitting || mode === "edit"}
                className="ml-auto bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setMode(mode === "view" ? "comment" : "view")}
                variant="destructive"
                size="sm"
                disabled={submitting || mode === "edit"}
              >
                <XCircle className="mr-2 h-4 w-4" />
                {mode === "comment" ? "Cancel" : "Reject"}
              </Button>
            </motion.div>
          </div>
        )}

        {/* Edit Mode Form */}
        <AnimatePresence>
          {mode === "edit" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4 border-t pt-4"
            >
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                💡 Modify targets and weightage below. Employee will be notified of changes.
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleModify}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={submitting}
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setMode("view");
                    setEditedTarget(goal.target.toString());
                    setEditedWeightage(goal.weightage.toString());
                  }}
                  variant="outline"
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment Mode */}
        <AnimatePresence>
          {mode === "comment" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4 border-t pt-4"
            >
              <Textarea
                placeholder="Add comments for the employee..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="min-h-24"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={submitting}
                >
                  Approve with Comment
                </Button>
                <Button
                  onClick={() => {
                    setMode("view");
                    setComments("");
                  }}
                  variant="outline"
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment/Reject Mode */}
        <AnimatePresence>
          {mode === "comment" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4 border-t pt-4"
            >
              <Textarea
                placeholder="Explain why this goal needs changes..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-24 border-red-200 bg-red-50"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  className="flex-1"
                  disabled={submitting}
                >
                  Send Back for Revision
                </Button>
                <Button
                  onClick={() => {
                    setMode("view");
                    setReason("");
                  }}
                  variant="outline"
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
