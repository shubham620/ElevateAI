// types/index.ts
import { Role, GoalStatus, ApprovalStatus, CheckinStatus, NotificationType, InsightType } from "@prisma/client"

export type { Role, GoalStatus, ApprovalStatus, CheckinStatus, NotificationType, InsightType }

export interface User {
  id: string
  email: string
  name: string
  role: Role
  department?: string
  avatar?: string
  managerId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Goal {
  id: string
  title: string
  description: string
  thrustArea: string
  kpiType: string
  target: number
  progress: number
  status: GoalStatus
  approvalStatus: ApprovalStatus
  weightage: number
  deadline: Date
  locked: boolean
  employeeId: string
  sharedGoalId?: string
  createdAt: Date
  updatedAt: Date
  employee?: User
  checkins?: QuarterlyCheckin[]
}

export interface QuarterlyCheckin {
  id: string
  goalId: string
  userId: string
  quarter: string
  year: number
  achievement: string
  progress: number
  status: CheckinStatus
  managerComment?: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  message: string
  read: boolean
  relatedId?: string
  createdAt: Date
}

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
  department?: string
}

export interface ActivityLog {
  id: string
  action: string
  userId: string
  goalId?: string
  oldValue?: string
  newValue?: string
  timestamp: Date
}

export interface AIInsight {
  id: string
  userId: string
  insightType: InsightType
  title: string
  content: string
  createdAt: Date
}

export interface WorkHealthScore {
  score: number
  consistency: number
  completion: number
  engagement: number
  trend: number
  discipline: number
}

export interface PerformanceMetrics {
  totalGoals: number
  completedGoals: number
  inProgressGoals: number
  atRiskGoals: number
  overallProgress: number
  averageWeightage: number
}

export interface DashboardStats {
  totalEmployees: number
  activeGoals: number
  completionRate: number
  riskAlerts: number
  pendingApprovals: number
}
