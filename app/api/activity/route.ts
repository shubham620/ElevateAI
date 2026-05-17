// app/api/activity/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getActivityFeed } from "@/lib/activity";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const feed = await getActivityFeed(session.user.id, limit, offset);

    // Map to ActivityItem format
    const activities = feed.map((item) => ({
      id: item.id,
      type: item.type,
      message: item.message,
      goalTitle: item.goalTitle,
      user: item.user,
      timestamp: item.timestamp,
      severity:
        item.type === "GOAL_APPROVED"
          ? "success"
          : item.type === "GOAL_REJECTED" || item.type === "RISK_ALERT"
            ? "warning"
            : "info",
    }));

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
