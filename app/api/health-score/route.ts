// app/api/health-score/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { calculateWorkHealthScore, getHealthScoreTrend } from "@/lib/score";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || session.user.id;
    const days = parseInt(searchParams.get("days") || "30");

    // Calculate current health score
    const score = await calculateWorkHealthScore(userId);

    // Get trend data
    const trend = await getHealthScoreTrend(userId, days);

    return NextResponse.json({
      score: score.score,
      consistency: score.consistency,
      completion: score.completion,
      engagement: score.engagement,
      productivity: score.productivity,
      discipline: score.discipline,
      trend,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Error calculating health score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
