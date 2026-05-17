// app/api/checkins/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { z } from "zod";

const createCheckinSchema = z.object({
  goalId: z.string().min(1),
  quarter: z.string().min(1),
  achievement: z.string().min(1),
  status: z.enum(["NOT_STARTED", "ON_TRACK", "COMPLETED"]),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const goalId = searchParams.get("goalId");
    const quarter = searchParams.get("quarter");

    let where: any = {};
    if (goalId) {
      where.goalId = goalId;
    }
    if (quarter) {
      where.quarter = quarter;
    }

    const checkins = await prisma.quarterlyCheckin.findMany({
      where,
      include: {
        goal: {
          include: {
            employee: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(checkins);
  } catch (error) {
    console.error("Error fetching checkins:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = createCheckinSchema.parse(body);

    // Verify goal exists and belongs to user
    const goal = await prisma.goal.findUnique({
      where: { id: validated.goalId },
    });

    if (!goal || goal.employeeId !== session.user.id) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Check for existing checkin for this quarter
    const existing = await prisma.quarterlyCheckin.findFirst({
      where: {
        goalId: validated.goalId,
        quarter: validated.quarter,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Checkin already exists for this quarter" },
        { status: 400 }
      );
    }

    // Create checkin
    const checkin = await prisma.quarterlyCheckin.create({
      data: {
        goalId: validated.goalId,
        userId: session.user.id,
        quarter: validated.quarter,
        year: new Date().getFullYear(),
        achievement: validated.achievement,
        status: validated.status,
        progress: 0,
      },
      include: {
        goal: true,
      },
    });

    // Log activity
    await logActivity({
      type: "CHECKIN_SUBMITTED",
      userId: session.user.id,
      goalId: validated.goalId,
      message: `Submitted ${validated.quarter} check-in for "${goal.title}"`,
    });

    return NextResponse.json(checkin, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating checkin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
