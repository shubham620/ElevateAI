// components/activity-feed/activity-feed.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertCircle,
  MessageSquareText,
  Zap,
  User,
  Target,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type:
    | "GOAL_APPROVED"
    | "GOAL_REJECTED"
    | "CHECKIN_SUBMITTED"
    | "COMMENT_ADDED"
    | "RISK_ALERT"
    | "REVIEW_GENERATED"
    | "AI_INSIGHT";
  message: string;
  goalTitle?: string;
  user: { name: string; avatar?: string };
  timestamp: Date;
  severity?: "info" | "warning" | "success" | "error";
}

interface ActivityFeedProps {
  userId: string;
  limit?: number;
  showHeader?: boolean;
}

export function ActivityFeed({
  userId,
  limit = 10,
  showHeader = true,
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    // Refresh every 30 seconds for demo
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/activity?userId=${userId}&limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: ActivityItem["type"]) => {
    const iconProps = { className: "h-5 w-5" };
    switch (type) {
      case "GOAL_APPROVED":
        return <CheckCircle2 {...iconProps} className="text-green-600" />;
      case "GOAL_REJECTED":
        return <AlertCircle {...iconProps} className="text-red-600" />;
      case "CHECKIN_SUBMITTED":
        return <Target {...iconProps} className="text-blue-600" />;
      case "COMMENT_ADDED":
        return <MessageSquareText {...iconProps} className="text-purple-600" />;
      case "RISK_ALERT":
        return <AlertCircle {...iconProps} className="text-orange-600" />;
      case "REVIEW_GENERATED":
        return <Zap {...iconProps} className="text-yellow-600" />;
      case "AI_INSIGHT":
        return <Zap {...iconProps} className="text-indigo-600" />;
      default:
        return <MessageSquareText {...iconProps} />;
    }
  };

  const getBadgeVariant = (
    severity?: "info" | "warning" | "success" | "error"
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case "success":
        return "default";
      case "error":
        return "destructive";
      case "warning":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">Loading activities...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Activity Feed
          </h2>
          <p className="text-sm text-gray-600">
            Track updates, approvals, and insights in real-time
          </p>
        </motion.div>
      )}

      {activities.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageSquareText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600">No activities yet</p>
          <p className="text-sm text-gray-500">
            When goals are updated or reviewed, they'll appear here
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-gray-200 hover:border-l-blue-400">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">{getIcon(activity.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-3 w-3 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-900">
                            {activity.user.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {activity.message}
                        </p>
                        {activity.goalTitle && (
                          <p className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                            <Target className="h-3 w-3" />
                            Goal: <span className="font-medium">{activity.goalTitle}</span>
                          </p>
                        )}
                      </div>

                      {/* Badge and Time */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {activity.severity && (
                          <Badge variant={getBadgeVariant(activity.severity)}>
                            {activity.type
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0) + word.slice(1).toLowerCase()
                              )
                              .join(" ")}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {activities.length >= limit && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchActivities}
          className="w-full py-2 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50 transition rounded-lg"
        >
          Load more activities
        </motion.button>
      )}
    </div>
  );
}

// Timeline variant - for achievement visualization
export function ActivityTimeline({
  activities,
  showHeader = true,
}: {
  activities: ActivityItem[];
  showHeader?: boolean;
}) {
  return (
    <div className="space-y-6">
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-900">Timeline</h2>
          <p className="text-sm text-gray-600">
            Milestone history and achievements
          </p>
        </motion.div>
      )}

      <div className="relative space-y-4">
        {/* Timeline line */}
        <div className="absolute left-[18px] top-12 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent" />

        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-16 pb-6"
          >
            {/* Timeline dot */}
            <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-white border-4 border-blue-200">
              {getIcon(activity.type)}
            </div>

            {/* Content card */}
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {activity.message}
                  </p>
                  {activity.goalTitle && (
                    <p className="mt-1 text-sm text-gray-600">
                      Goal: {activity.goalTitle}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get icon based on type
function getIcon(type: ActivityItem["type"]) {
  const iconProps = { className: "h-5 w-5" };
  switch (type) {
    case "GOAL_APPROVED":
      return <CheckCircle2 {...iconProps} className="text-green-600" />;
    case "GOAL_REJECTED":
      return <AlertCircle {...iconProps} className="text-red-600" />;
    case "CHECKIN_SUBMITTED":
      return <Target {...iconProps} className="text-blue-600" />;
    case "COMMENT_ADDED":
      return <MessageSquareText {...iconProps} className="text-purple-600" />;
    case "RISK_ALERT":
      return <AlertCircle {...iconProps} className="text-orange-600" />;
    case "REVIEW_GENERATED":
      return <Zap {...iconProps} className="text-yellow-600" />;
    case "AI_INSIGHT":
      return <Zap {...iconProps} className="text-indigo-600" />;
    default:
      return <MessageSquareText {...iconProps} />;
  }
}
