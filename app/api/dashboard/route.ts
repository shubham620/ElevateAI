// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(auth)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role

    if (userRole === "EMPLOYEE") {
      // Employee dashboard
      const goals = await prisma.goal.findMany({
        where: { employeeId: session.user.id },
        include: { checkins: true },
      })

      const totalGoals = goals.length
      const completedGoals = goals.filter(g => g.status === "COMPLETED").length
      const inProgressGoals = goals.filter(g => g.status === "IN_PROGRESS").length
      const atRiskGoals = goals.filter(g => {
        const daysLeft = Math.ceil((g.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        return daysLeft < 30 && g.progress < g.target * 0.8
      }).length

      const overallProgress = goals.length > 0
        ? Math.round(goals.reduce((sum, g) => sum + (g.progress / g.target * g.weightage), 0) / 100)
        : 0

      const notifications = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      })

      return NextResponse.json({
        type: "employee",
        stats: {
          totalGoals,
          completedGoals,
          inProgressGoals,
          atRiskGoals,
          overallProgress,
        },
        goals,
        notifications,
      })
    } else if (userRole === "MANAGER") {
      // Manager dashboard
      const teamMembers = await prisma.user.findMany({
        where: { managerId: session.user.id },
      })

      const teamGoals = await prisma.goal.findMany({
        where: { employeeId: { in: teamMembers.map(m => m.id) } },
        include: { employee: true },
      })

      const pendingApprovals = teamGoals.filter(g => g.approvalStatus === "PENDING").length
      const completionRate = teamGoals.length > 0
        ? Math.round((teamGoals.filter(g => g.status === "COMPLETED").length / teamGoals.length) * 100)
        : 0

      return NextResponse.json({
        type: "manager",
        stats: {
          teamMembers: teamMembers.length,
          activeGoals: teamGoals.filter(g => g.status === "IN_PROGRESS").length,
          completionRate,
          pendingApprovals,
          atRiskGoals: teamGoals.filter(g => {
            const daysLeft = Math.ceil((g.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            return daysLeft < 30 && g.progress < g.target * 0.8
          }).length,
        },
        teamMembers,
        goals: teamGoals,
      })
    } else if (userRole === "ADMIN") {
      // Admin dashboard
      const allUsers = await prisma.user.findMany()
      const allGoals = await prisma.goal.findMany({
        include: { employee: true },
      })

      const departments = [...new Set(allUsers.map(u => u.department))]

      return NextResponse.json({
        type: "admin",
        stats: {
          totalEmployees: allUsers.filter(u => u.role === "EMPLOYEE").length,
          activeGoals: allGoals.filter(g => g.status === "IN_PROGRESS").length,
          completionRate: allGoals.length > 0
            ? Math.round((allGoals.filter(g => g.status === "COMPLETED").length / allGoals.length) * 100)
            : 0,
          riskAlerts: allGoals.filter(g => {
            const daysLeft = Math.ceil((g.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            return daysLeft < 30 && g.progress < g.target * 0.8
          }).length,
        },
        departments,
        totalUsers: allUsers.length,
        totalGoals: allGoals.length,
      })
    }

    return NextResponse.json({ message: "Invalid role" }, { status: 400 })
  } catch (error) {
    console.error("GET /api/dashboard error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
