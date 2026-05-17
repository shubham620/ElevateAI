// app/api/goals/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logActivity } from "@/lib/activity"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")
    const status = searchParams.get("status")

    let where: any = {}

    if (employeeId) {
      where.employeeId = employeeId
    } else {
      where.employeeId = session.user.id
    }

    if (status) {
      where.status = status
    }

    const goals = await prisma.goal.findMany({
      where,
      include: {
        employee: true,
        checkins: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error("GET /api/goals error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, thrustArea, kpiType, target, weightage, deadline } = body

    // Validate weightage
    const existingGoals = await prisma.goal.findMany({
      where: { employeeId: session.user.id },
    })

    const totalWeightage = existingGoals.reduce(
      (sum: number, goal: any) => sum + goal.weightage,
      0
    ) + weightage

    if (totalWeightage > 100) {
      return NextResponse.json(
        { message: "Total weightage cannot exceed 100%" },
        { status: 400 }
      )
    }

    if (weightage < 10) {
      return NextResponse.json(
        { message: "Each goal must have at least 10% weightage" },
        { status: 400 }
      )
    }

    if (existingGoals.length >= 8) {
      return NextResponse.json(
        { message: "Maximum 8 goals allowed" },
        { status: 400 }
      )
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        thrustArea,
        kpiType,
        target,
        weightage,
        deadline: new Date(deadline),
        employeeId: session.user.id,
      },
    })

    // Log activity
    await logActivity({
      type: "GOAL_CREATED",
      userId: session.user.id,
      goalId: goal.id,
      message: `Created goal "${goal.title}"`,
      metadata: { title, thrustArea, kpiType },
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error("POST /api/goals error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
