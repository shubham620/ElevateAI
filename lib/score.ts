// lib/score.ts
import { prisma } from "./prisma";

// Calculate Work Health Score based on multiple metrics
export async function calculateWorkHealthScore(
  userId: string
): Promise<{
  score: number;
  consistency: number;
  completion: number;
  engagement: number;
  productivity: number;
  discipline: number;
}> {
  const goals = await prisma.goal.findMany({
    where: { employeeId: userId },
    include: {
      checkins: true,
      activities: true,
    },
  });

  if (goals.length === 0) {
    return {
      score: 0,
      consistency: 0,
      completion: 0,
      engagement: 0,
      productivity: 0,
      discipline: 0,
    };
  }

  // 1. Consistency Score (regular updates)
  const consistency = calculateConsistency(goals);

  // 2. Completion Score (overall progress)
  const completion = calculateCompletion(goals);

  // 3. Engagement Score (activity level)
  const engagement = calculateEngagement(goals);

  // 4. Productivity Score (progress velocity)
  const productivity = calculateProductivity(goals);

  // 5. Deadline Discipline (on-time delivery)
  const discipline = calculateDeadlineDiscipline(goals);

  // Overall score: weighted average
  const score = Math.round(
    consistency * 0.2 +
      completion * 0.3 +
      engagement * 0.2 +
      productivity * 0.15 +
      discipline * 0.15
  );

  return {
    score: Math.max(0, Math.min(100, score)),
    consistency: Math.round(consistency),
    completion: Math.round(completion),
    engagement: Math.round(engagement),
    productivity: Math.round(productivity),
    discipline: Math.round(discipline),
  };
}

// Calculate consistency based on update frequency
function calculateConsistency(
  goals: any[]
): number {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const goalsWithUpdates = goals.filter((g) => {
    const latestCheckin = g.checkins.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    return (
      latestCheckin &&
      new Date(latestCheckin.createdAt).getTime() > thirtyDaysAgo
    );
  });

  // Average days between updates for recent goals
  const avgDaysBetweenUpdates = goals.length
    ? Math.max(
        1,
        goals.reduce((sum, g) => {
          if (g.checkins.length < 2) return sum;
          const sortedCheckins = g.checkins.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          let gaps = [];
          for (let i = 0; i < sortedCheckins.length - 1; i++) {
            const gap = Math.abs(
              new Date(sortedCheckins[i].createdAt).getTime() -
                new Date(sortedCheckins[i + 1].createdAt).getTime()
            );
            gaps.push(gap / (1000 * 60 * 60 * 24));
          }
          return sum + (gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 14);
        }, 0) / goals.length
      )
    : 14;

  // Score: ideal is 7 days, penalty for longer gaps
  return Math.max(0, 100 - avgDaysBetweenUpdates * 5);
}

// Calculate completion based on overall progress
function calculateCompletion(goals: any[]): number {
  if (goals.length === 0) return 0;
  const avgProgress = goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length;
  return Math.min(100, avgProgress);
}

// Calculate engagement based on activity
function calculateEngagement(goals: any[]): number {
  const totalCheckins = goals.reduce((sum, g) => sum + g.checkins.length, 0);
  const totalActivities = goals.reduce((sum, g) => sum + (g.activities ? g.activities.length : 0), 0);
  const engagementRatio = goals.length ? (totalCheckins + totalActivities / 5) / goals.length : 0;
  return Math.min(100, engagementRatio * 20);
}

// Calculate productivity based on progress velocity
function calculateProductivity(goals: any[]): number {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const velocities = goals.map((g) => {
    const recentCheckins = g.checkins.filter(
      (c: any) => new Date(c.createdAt).getTime() > thirtyDaysAgo
    );
    if (recentCheckins.length < 2) return 0;

    const sorted = recentCheckins.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const firstProgress = parseFloat(sorted[0].achievement) || 0;
    const lastProgress = parseFloat(sorted[sorted.length - 1].achievement) || 0;
    const progressGain = Math.max(0, lastProgress - firstProgress);
    const days = (sorted[sorted.length - 1].createdAt - sorted[0].createdAt) / (1000 * 60 * 60 * 24) || 1;
    return (progressGain / days) * 30; // Normalize to 30-day period
  });

  const avgVelocity = velocities.length ? velocities.reduce((a, b) => a + b, 0) / velocities.length : 0;
  return Math.min(100, avgVelocity);
}

// Calculate deadline discipline based on status
function calculateDeadlineDiscipline(goals: any[]): number {
  if (goals.length === 0) return 0;

  const completedOnTime = goals.filter((g) => {
    if (g.status !== "COMPLETED" || !g.deadline) return false;
    return new Date(g.updatedAt) <= new Date(g.deadline);
  }).length;

  const onTrackGoals = goals.filter((g) => g.status === "IN_PROGRESS").length;
  const atRiskGoals = goals.filter((g) => {
    if (!g.deadline) return false;
    const daysLeft = (new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysLeft < 0 || (g.progress < daysLeft * (100 / Math.max(1, daysLeft + 30)) && g.status === "IN_PROGRESS");
  }).length;

  const discipline = (completedOnTime + Math.max(0, onTrackGoals - atRiskGoals)) / goals.length;
  return Math.min(100, discipline * 100);
}

// Get health score trend
export async function getHealthScoreTrend(
  userId: string,
  days: number = 30
): Promise<Array<{ date: string; score: number }>> {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  const checkins = await prisma.quarterlyCheckin.findMany({
    where: {
      goal: {
        employeeId: userId,
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      goal: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Calculate score for each day with activity
  const scores: { [key: string]: number[] } = {};

  for (const checkin of checkins) {
    const date = new Date(checkin.createdAt);
    const dateStr = date.toISOString().split("T")[0];

    if (!scores[dateStr]) {
      scores[dateStr] = [];
    }

    // Simple metric: progress value
    scores[dateStr].push(checkin.progress || 0);
  }

  // Convert to trend data
  const trend = Object.entries(scores).map(([date, values]) => ({
    date,
    score: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
  }));

  return trend;
}

// Compare scores across team (for manager)
export async function getTeamHealthScores(
  managerId: string
): Promise<Array<{ name: string; score: number; trend: "up" | "down" | "stable"; }>> {
  const employees = await prisma.user.findMany({
    where: {
      managerId: managerId,
    },
  });

  const scores = await Promise.all(
    employees.map(async (emp) => {
      const score = await calculateWorkHealthScore(emp.id);
      return {
        name: emp.name,
        score: score.score,
        trend: (score.productivity > 50 ? "up" : score.productivity < 30 ? "down" : "stable") as "up" | "down" | "stable",
      };
    })
  );

  return scores.sort((a, b) => b.score - a.score);
}
