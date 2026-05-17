// app/api/checkins/[checkinId]/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { z } from "zod";

const updateCheckinSchema = z.object({
  achievement: z.string().optional(),
  status: z.enum(["NOT_STARTED", "ON_TRACK", "COMPLETED"]).optional(),
  managerComment: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checkin = await prisma.quarterlyCheckin.findUnique({
      where: { id: params.checkinId },
      include: {
        goal: {
          include: {
            employee: true,
          },
        },
      },
    });

    if (!checkin) {
      return NextResponse.json({ error: "Checkin not found" }, { status: 404 });
    }

    // Verify access
    const isEmployee = checkin.goal.employeeId === session.user.id;
    const isManager = checkin.goal.employee.managerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isEmployee && !isManager && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(checkin);
  } catch (error) {
    console.error("Error fetching checkin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: any
) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = updateCheckinSchema.parse(body);

    const checkin = await prisma.quarterlyCheckin.findUnique({
      where: { id: params.checkinId },
      include: {
        goal: {
          include: {
            employee: true,
          },
        },
      },
    });

    if (!checkin) {
      return NextResponse.json({ error: "Checkin not found" }, { status: 404 });
    }

    // Check permissions
    const isEmployee = checkin.goal.employeeId === session.user.id;
    const isManager =
      checkin.goal.employee.managerId === session.user.id ||
      session.user.role === "ADMIN";

    if (!isEmployee && !isManager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only employee can update achievement/status
    // Only manager can add comments
    if (isEmployee && !isManager) {
      if (validated.managerComment) {
        return NextResponse.json(
          { error: "Only managers can add comments" },
          { status: 403 }
        );
      }
    }

    const updateData: any = {};
    if (validated.achievement !== undefined) {
      updateData.achievement = validated.achievement;
    }
    if (validated.status !== undefined) {
      updateData.status = validated.status;
    }
    if (validated.managerComment !== undefined) {
      updateData.managerComment = validated.managerComment;
    }

    const updated = await prisma.quarterlyCheckin.update({
      where: { id: params.checkinId },
      data: updateData,
      include: {
        goal: true,
      },
    });

    // Log activity
    const action = validated.managerComment ? "CHECKIN_REVIEWED" : "CHECKIN_SUBMITTED";
    await logActivity({
      type: action,
      userId: session.user.id,
      goalId: checkin.goalId,
      message: `Updated ${checkin.quarter} check-in for "${checkin.goal.title}"`,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating checkin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checkin = await prisma.quarterlyCheckin.findUnique({
      where: { id: params.checkinId },
      include: {
        goal: true,
      },
    });

    if (!checkin) {
      return NextResponse.json({ error: "Checkin not found" }, { status: 404 });
    }

    await prisma.quarterlyCheckin.delete({
      where: { id: params.checkinId },
    });

    await logActivity({
      type: "CHECKIN_SUBMITTED",
      userId: session.user.id,
      goalId: checkin.goalId,
      message: `Deleted check-in for "${checkin.goal.title}"`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting checkin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
