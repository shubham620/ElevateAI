// types/index.ts

export type Role = "EMPLOYEE" | "MANAGER" | "ADMIN"
export type GoalStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "REWORK"
export type CheckinStatus = "NOT_STARTED" | "ON_TRACK" | "AT_RISK" | "COMPLETED" | "DELAYED"
export type NotificationType = "GOAL_APPROVED" | "GOAL_REJECTED" | "GOAL_REWORK" | "GOAL_COMMENT" | "CHECKIN_APPROVED" | "NEW_SHARED_GOAL" | "RISK_ALERT" | "ACHIEVEMENT_MILESTONE"
export type InsightType = "GOAL_QUALITY" | "RISK_PREDICTION" | "PERFORMANCE_TREND" | "SMART_RECOMMENDATION" | "REVIEW_DRAFT" | "PRODUCTIVITY_SCORE" | "DELAY_WARNING"

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
