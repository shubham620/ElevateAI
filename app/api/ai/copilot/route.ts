// app/api/ai/copilot/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateSmartGoal,
  predictGoalRisk,
  processNaturalLanguageQuery,
} from "@/lib/openai";
import { calculateWorkHealthScore } from "@/lib/score";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, userRole, conversationHistory } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let response = "";

    // Detect intent from message
    const lowerMessage = message.toLowerCase();

    // Intent: Generate/create goal
    if (
      lowerMessage.includes("create") ||
      lowerMessage.includes("generate") ||
      lowerMessage.includes("help me") ||
      lowerMessage.includes("new goal")
    ) {
      response = await handleGoalGeneration(message, session.user.id);
    }
    // Intent: Analyze performance
    else if (
      lowerMessage.includes("analyze") ||
      lowerMessage.includes("performance") ||
      lowerMessage.includes("progress")
    ) {
      response = await handlePerformanceAnalysis(
        session.user.id,
        userRole,
        message
      );
    }
    // Intent: Check risks
    else if (
      lowerMessage.includes("risk") ||
      lowerMessage.includes("delayed") ||
      lowerMessage.includes("stuck") ||
      lowerMessage.includes("behind")
    ) {
      response = await handleRiskAnalysis(session.user.id);
    }
    // Intent: Natural language query
    else if (
      lowerMessage.includes("show") ||
      lowerMessage.includes("which") ||
      lowerMessage.includes("how many")
    ) {
      response = await handleNaturalLanguageQuery(
        message,
        session.user.id,
        userRole
      );
    }
    // Default: Contextual help
    else {
      response = await handleContextualHelp(message, session.user.id);
    }

    return NextResponse.json({
      response,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("AI Copilot error:", error);
    return NextResponse.json(
      {
        response:
          "I encountered an error processing your request. Please try again.",
      },
      { status: 200 }
    );
  }
}

// Handle goal generation requests
async function handleGoalGeneration(
  message: string,
  userId: string
): Promise<string> {
  try {
    // Extract the goal idea from message
    const goalIdea = message
      .replace(/create|generate|help me|new goal/gi, "")
      .trim();

    if (!goalIdea || goalIdea.length < 5) {
      return "📝 Please describe what you'd like to achieve. Example: 'Improve customer satisfaction by 20%' or 'Lead a major product launch'";
    }

    const smartGoal = await generateSmartGoal(goalIdea);

    return `✨ Here's a SMART goal based on your idea:

📌 **${smartGoal.title}**

📊 Description: ${smartGoal.description}

🎯 KPI: ${smartGoal.kpiType}
📈 Target: ${smartGoal.target}
⭐ SMART Score: ${smartGoal.smartScore}/100

${smartGoal.suggestion}

Ready to create this goal? You can adjust the details before submitting.`;
  } catch (error) {
    console.error("Goal generation error:", error);
    return "I had trouble generating a SMART goal. Could you provide more details about what you're trying to accomplish?";
  }
}

// Handle performance analysis
async function handlePerformanceAnalysis(
  userId: string,
  userRole: string,
  message: string
): Promise<string> {
  try {
    const healthScore = await calculateWorkHealthScore(userId);

    const goals = await prisma.goal.findMany({
      where: { employeeId: userId },
      include: { checkins: true },
    });

    const completedGoals = goals.filter((g: any) => g.status === "COMPLETED").length;
    const atRiskGoals = goals.filter((g: any) => {
      const daysLeft =
        (new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return (
        daysLeft < 0 || (g.progress < daysLeft * (100 / Math.max(1, daysLeft + 30)) &&
        g.status === "IN_PROGRESS")
      );
    }).length;

    return `📈 **Performance Analysis**

Overall Health Score: **${healthScore.score}/100**

💪 Strengths:
• Consistency: ${healthScore.consistency}/100
• Completion Rate: ${healthScore.completion}/100
• Engagement: ${healthScore.engagement}/100

✏️ Breakdown:
• Total Goals: ${goals.length}
• Completed: ${completedGoals}
• In Progress: ${goals.filter((g: any) => g.status === "IN_PROGRESS").length}
• At Risk: ${atRiskGoals}

📊 Productivity Score: ${healthScore.productivity}/100
⏰ Deadline Discipline: ${healthScore.discipline}/100

${
  healthScore.score >= 80
    ? "🎉 Great job! You're performing excellently."
    : healthScore.score >= 60
      ? "👍 Good performance. Focus on improving consistency with regular updates."
      : "⚠️ Your performance needs attention. Let's discuss your blockers."
}`;
  } catch (error) {
    console.error("Performance analysis error:", error);
    return "I couldn't analyze your performance. Please try again.";
  }
}

// Handle risk analysis
async function handleRiskAnalysis(userId: string): Promise<string> {
  try {
    const goals = await prisma.goal.findMany({
      where: { employeeId: userId },
    });

    const atRiskGoals = [];

    for (const goal of goals) {
      if (goal.status !== "COMPLETED") {
        const daysRemaining =
          (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        const riskInfo = await predictGoalRisk(
          goal.title,
          goal.progress,
          daysRemaining,
          new Date(goal.updatedAt)
        );

        if (
          riskInfo.riskLevel === "high" ||
          riskInfo.riskLevel === "medium"
        ) {
          atRiskGoals.push({
            title: goal.title,
            ...riskInfo,
          });
        }
      }
    }

    if (atRiskGoals.length === 0) {
      return "✅ All your goals are on track! No risks detected.";
    }

    let response = `⚠️ **Found ${atRiskGoals.length} At-Risk Goals**\n\n`;

    atRiskGoals.forEach((goal, index) => {
      response += `${index + 1}. **${goal.title}**\n`;
      response += `   Risk Level: ${goal.riskLevel.toUpperCase()} (${goal.riskScore}%)\n`;
      response += `   Factors: ${goal.factors.join(", ")}\n`;
      response += `   Recommended: ${goal.recommendations[0]}\n\n`;
    });

    response += `💡 **Action Items:**\n`;
    atRiskGoals.slice(0, 2).forEach((goal) => {
      response += `• ${goal.recommendations[0]}\n`;
    });

    return response;
  } catch (error) {
    console.error("Risk analysis error:", error);
    return "I couldn't analyze your risks. Please try again.";
  }
}

// Handle natural language queries
async function handleNaturalLanguageQuery(
  query: string,
  userId: string,
  userRole: string
): Promise<string> {
  try {
    let context: any = {
      goals: [],
      employees: [],
    };

    // Employee context
    if (userRole === "EMPLOYEE") {
      const goals = await prisma.goal.findMany({
        where: { employeeId: userId },
      });
      context.goals = goals.map((g: any) => ({
        title: g.title,
        progress: g.progress,
        status: g.status,
      }));
    }
    // Manager context
    else if (userRole === "MANAGER") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          employees: {
            include: {
              goals: true,
            },
          },
        },
      });

      if (user?.employees) {
        context.employees = user.employees.map((emp: any) => ({
          name: emp.name,
          healthScore: 75, // Will be calculated
          goals: emp.goals,
        }));
      }
    }

    const response = await processNaturalLanguageQuery(query, context);
    return response;
  } catch (error) {
    console.error("NL query error:", error);
    return "I couldn't process that query. Could you rephrase it?";
  }
}

// Handle contextual help
async function handleContextualHelp(
  message: string,
  userId: string
): Promise<string> {
  return `🤖 I'm here to help with your performance goals!

Try asking me:
• "Generate a goal for [topic]"
• "Analyze my performance"
• "Which goals are at risk?"
• "Show delayed Q2 goals"
• "Generate my quarterly review"
• "Why am I stuck on [goal]?"

Or tell me about your goals, and I'll provide insights and recommendations. What would you like to work on?`;
}
