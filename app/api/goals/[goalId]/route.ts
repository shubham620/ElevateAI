// app/api/goals/[goalId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logActivity } from "@/lib/activity"

export async function PATCH(
  request: NextRequest,
  { params }: any
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const goal = await prisma.goal.findUnique({
      where: { id: params.goalId },
    })

    if (!goal) {
      return NextResponse.json(
        { message: "Goal not found" },
        { status: 404 }
      )
    }

    // Check authorization
    if (goal.employeeId !== session.user.id && (session.user as any).role !== "MANAGER" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    if (goal.locked && (session.user as any).role === "EMPLOYEE") {
      return NextResponse.json(
        { message: "Goal is locked and cannot be edited" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, target, progress, status, approvalStatus, weightage } = body

    const updatedGoal = await prisma.goal.update({
      where: { id: params.goalId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(target !== undefined && { target }),
        ...(progress !== undefined && { progress }),
        ...(status && { status }),
        ...(approvalStatus && { approvalStatus }),
        ...(weightage !== undefined && { weightage }),
      },
    })

    // Log activity
    await logActivity({
      type: "GOAL_UPDATED",
      userId: session.user.id,
      goalId: goal.id,
      message: `Updated goal "${goal.title}"`,
      metadata: { changes: { title, target, progress, status } },
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error("PATCH /api/goals/[goalId] error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const goal = await prisma.goal.findUnique({
      where: { id: params.goalId },
    })

    if (!goal) {
      return NextResponse.json(
        { message: "Goal not found" },
        { status: 404 }
      )
    }

    if (goal.employeeId !== session.user.id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    await prisma.goal.delete({
      where: { id: params.goalId },
    })

    // Log activity
    await logActivity({
      type: "GOAL_DELETED",
      userId: session.user.id,
      goalId: goal.id,
      message: `Deleted goal "${goal.title}"`,
    })

    return NextResponse.json({ message: "Goal deleted" })
  } catch (error) {
    console.error("DELETE /api/goals/[goalId] error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
