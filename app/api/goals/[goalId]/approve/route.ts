// app/api/goals/[goalId]/approve/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logActivity } from "@/lib/activity"

export async function POST(
  request: NextRequest,
  { params }: any
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role

    if (userRole !== "MANAGER" && userRole !== "ADMIN") {
      return NextResponse.json(
        { message: "Only managers can approve goals" },
        { status: 403 }
      )
    }

    const goal = await prisma.goal.findUnique({
      where: { id: params.goalId },
      include: { employee: true },
    })

    if (!goal) {
      return NextResponse.json(
        { message: "Goal not found" },
        { status: 404 }
      )
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: params.goalId },
      data: {
        approvalStatus: "APPROVED",
        status: "APPROVED",
        locked: true,
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: goal.employeeId,
        type: "GOAL_APPROVED",
        message: `Your goal "${goal.title}" has been approved`,
        relatedId: goal.id,
      },
    })

    // Log activity
    await logActivity({
      type: "GOAL_APPROVED",
      userId: session.user.id,
      goalId: goal.id,
      message: `Approved goal "${goal.title}" for ${goal.employee.name}`,
      metadata: { approvedBy: session.user.id },
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error("POST approve error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
