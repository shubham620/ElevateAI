// lib/activity.ts
import { prisma } from "./prisma";
import { NotificationType } from "@prisma/client";

export type ActivityType =
  | "GOAL_CREATED"
  | "GOAL_UPDATED"
  | "GOAL_DELETED"
  | "GOAL_APPROVED"
  | "GOAL_REJECTED"
  | "GOAL_LOCKED"
  | "GOAL_UNLOCKED"
  | "CHECKIN_SUBMITTED"
  | "CHECKIN_REVIEWED"
  | "COMMENT_ADDED"
  | "RISK_ALERT"
  | "REVIEW_GENERATED"
  | "AI_INSIGHT";

export interface ActivityEvent {
  type: ActivityType;
  userId: string;
  goalId?: string;
  checkinId?: string;
  message: string;
  metadata?: Record<string, any>;
}

// Log activity
export async function logActivity(event: ActivityEvent): Promise<void> {
  try {
    // First, create/update activity log
    await prisma.activityLog.create({
      data: {
        action: event.type,
        newValue: event.message,
        userId: event.userId,
        goalId: event.goalId,
        metadata: event.metadata ? JSON.stringify(event.metadata) : undefined,
        timestamp: new Date(),
      },
    });

    // Also create notification for relevant users
    await createNotificationFromActivity(event);
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

// Create notifications based on activity
async function createNotificationFromActivity(
  event: ActivityEvent
): Promise<void> {
  const goal = event.goalId
    ? await prisma.goal.findUnique({
        where: { id: event.goalId },
        include: { employee: true },
      })
    : null;

  const notificationMap: { [key in ActivityType]?: (event: ActivityEvent, goal: any) => { userId: string; message: string; type: string } } = {
    GOAL_APPROVED: (event, goal) => ({
      userId: goal.employee.id,
      message: `Your goal "${goal.title}" has been approved`,
      type: "GOAL_APPROVED",
    }),
    GOAL_REJECTED: (event, goal) => ({
      userId: goal.employee.id,
      message: `Your goal "${goal.title}" requires changes`,
      type: "GOAL_REJECTED",
    }),
    CHECKIN_REVIEWED: (event, goal) => ({
      userId: goal.employee.id,
      message: `Your check-in for "${goal.title}" has been reviewed`,
      type: "CHECKIN_REVIEWED",
    }),
    RISK_ALERT: (event, goal) => ({
      userId: goal.employee.managerId || "",
      message: `Goal at risk: "${goal.title}"`,
      type: "RISK_ALERT",
    }),
    REVIEW_GENERATED: (event, goal) => ({
      userId: goal.employee.id,
      message: `Your quarterly review is ready`,
      type: "REVIEW_GENERATED",
    }),
  };

  if (goal && notificationMap[event.type]) {
    const notification = notificationMap[event.type]!(event, goal);
    if (notification.userId) {
      await prisma.notification.create({
        data: {
          type: notification.type as NotificationType,
          message: notification.message,
          read: false,
          userId: notification.userId,
        },
      });

      // Emit through socket.io if available
      emitActivityUpdate(notification.userId, event);
    }
  }
}

// Get activity feed for user
export async function getActivityFeed(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<Array<{
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  user: { name: string; avatar?: string };
  goalTitle?: string;
}>> {
  const activities = await prisma.activityLog.findMany({
    where: {
      OR: [
        { userId: userId }, // User's own activities
        {
          goal: {
            employeeId: userId, // Activities on user's goals
          },
        },
        {
          goal: {
            employee: {
              managerId: userId, // Activities on managed employees
            },
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
        },
      },
      goal: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: limit,
    skip: offset,
  });

  return activities.map((a) => ({
    id: a.id,
    type: a.action,
    message: (a as any).newValue ?? "",
    timestamp: a.timestamp,
    user: { name: a.user.name, avatar: a.user.avatar ?? undefined },
    goalTitle: a.goal?.title,
  }));
}

// Get dashboard activity summary
export async function getActivitySummary(
  userId: string,
  roleContext: "EMPLOYEE" | "MANAGER" | "ADMIN"
): Promise<{
  recentActivities: Array<{
    type: string;
    message: string;
    time: string;
  }>;
  highlights: Array<{
    icon: string;
    label: string;
    value: number;
  }>;
}> {
  const feed = await getActivityFeed(userId, 5);

  let accountQuery: any = {};
  if (roleContext === "EMPLOYEE") {
    accountQuery = { employeeId: userId };
  } else if (roleContext === "MANAGER") {
    accountQuery = {
      employee: {
        managerId: userId,
      },
    };
  }

  const goals = await prisma.goal.findMany({ where: accountQuery });
  const approved = goals.filter((g) => g.approvalStatus === "APPROVED").length;
  const completed = goals.filter((g) => g.status === "COMPLETED").length;
  const atRisk = goals.filter((g) => {
    const daysLeft = (new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysLeft < 7 && g.status !== "COMPLETED";
  }).length;

  return {
    recentActivities: feed.map((a) => ({
      type: a.type,
      message: a.message,
      time: formatTime(a.timestamp),
    })),
    highlights: [
      { icon: "✓", label: "Approved", value: approved },
      { icon: "🎯", label: "Completed", value: completed },
      { icon: "⚠️", label: "At Risk", value: atRisk },
    ],
  };
}

// Format time
function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

// Get goal-specific activity
export async function getGoalActivity(
  goalId: string,
  limit: number = 10
): Promise<Array<{
  type: string;
  message: string;
  timestamp: Date;
  user: { name: string };
  oldValue?: any;
  newValue?: any;
}>> {
  const activities = await prisma.activityLog.findMany({
    where: { goalId },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: limit,
  });

  return activities.map((a) => ({
    type: a.action,
    message: (a as any).newValue ?? "",
    timestamp: a.timestamp,
    user: a.user,
    oldValue: a.oldValue,
    newValue: a.newValue,
  }));
}

// Track goal state changes for audit
export async function captureGoalChange(
  goalId: string,
  userId: string,
  changes: Record<string, { old: any; new: any }>
): Promise<void> {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: { employee: true },
  });

  if (!goal) return;

  const changeMessages = Object.entries(changes)
    .map(([field, { old: oldVal, new: newVal }]) => {
      if (field === "progress") {
        return `Progress updated from ${oldVal}% to ${newVal}%`;
      } else if (field === "status") {
        return `Status changed from ${oldVal} to ${newVal}`;
      } else if (field === "target") {
        return `Target updated from ${oldVal} to ${newVal}`;
      }
      return `${field} updated`;
    })
    .join(", ");

  await logActivity({
    type: "GOAL_UPDATED",
    userId,
    goalId,
    message: changeMessages,
    metadata: changes,
  });
}

// Real-time activity stream setup
const socketEmitters: { [key: string]: (data: any) => void } = {};

export function registerActivityEmitter(
  userId: string,
  emitFn: (data: any) => void
): void {
  socketEmitters[userId] = emitFn;
}

export function unregisterActivityEmitter(userId: string): void {
  delete socketEmitters[userId];
}

function emitActivityUpdate(userId: string, event: ActivityEvent): void {
  if (socketEmitters[userId]) {
    socketEmitters[userId]({
      type: event.type,
      message: event.message,
      timestamp: new Date(),
    });
  }
}
