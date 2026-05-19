// lib/openai.ts
import OpenAI from "openai";

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// SMART Goal Generator
export async function generateSmartGoal(description: string): Promise<{
  title: string;
  description: string;
  kpiType: string;
  target: number;
  smartScore: number;
  suggestion: string;
}> {
  const openai = getOpenAIClient();
  const resp = await openai.chat.completions.create({
    model: "gpt-4",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Convert this rough goal idea into a SMART goal (Specific, Measurable, Achievable, Relevant, Time-bound). Return JSON with: title, description, kpiType, target (as number), smartScore (0-100).
        
Input: "${description}"

Return ONLY valid JSON (no markdown, no code blocks):
{
  "title": "specific goal title",
  "description": "detailed SMART description",
  "kpiType": "metric type (e.g., percentage, count, time)",
  "target": 90,
  "smartScore": 85
}`,
      },
    ],
  });

  const text = resp.choices?.[0]?.message?.content ?? "{}";

  // Extract JSON even if it contains markdown formatting
  let jsonStr = text;
  if (text.includes("```json")) {
    jsonStr = text.split("```json")[1].split("```")[0];
  } else if (text.includes("```")) {
    jsonStr = text.split("```")[1].split("```")[0];
  }

  const parsed = JSON.parse(jsonStr.trim());

  return {
    title: parsed.title,
    description: parsed.description,
    kpiType: parsed.kpiType,
    target: parsed.target,
    smartScore: parsed.smartScore,
    suggestion: `Goal converted to SMART format with confidence score of ${parsed.smartScore}/100`,
  };
}

// Analyze Goal Quality
export async function analyzeGoalQuality(
  title: string,
  description: string,
  target: number,
  kpiType: string
): Promise<{
  overallScore: number;
  clarity: number;
  measurability: number;
  realism: number;
  suggestions: string[];
}> {
  const openai = getOpenAIClient();
  const resp = await openai.chat.completions.create({
    model: "gpt-4",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze this goal's SMART quality:
Title: ${title}
Description: ${description}
Target: ${target} ${kpiType}

Score 1-10 for: clarity, measurability, realism. Return JSON:
{
  "clarity": 8,
  "measurability": 9,
  "realism": 7,
  "suggestions": ["suggestion 1", "suggestion 2"]
}

Return ONLY valid JSON (no markdown):`,
      },
    ],
  });

  const text = resp.choices?.[0]?.message?.content ?? "{}";

  // Extract JSON
  let jsonStr = text;
  if (text.includes("```json")) {
    jsonStr = text.split("```json")[1].split("```")[0];
  } else if (text.includes("```")) {
    jsonStr = text.split("```")[1].split("```")[0];
  }

  const parsed = JSON.parse(jsonStr.trim());
  const overallScore = Math.round(
    (parsed.clarity + parsed.measurability + parsed.realism) / 3
  );

  return {
    overallScore,
    clarity: parsed.clarity,
    measurability: parsed.measurability,
    realism: parsed.realism,
    suggestions: parsed.suggestions || [],
  };
}

// Generate Performance Review
export async function generatePerformanceReview(
  employeeName: string,
  goals: Array<{ title: string; progress: number; status: string }>,
  healthScore: number
): Promise<{
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}> {
  const openai = getOpenAIClient();
  const goalsText = goals
    .map((g) => `- ${g.title}: ${g.progress}% (${g.status})`)
    .join("\n");

  const resp = await openai.chat.completions.create({
    model: "gpt-4",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `Generate a professional quarterly review for ${employeeName}.

Goals:
${goalsText}

Health Score: ${healthScore}/100

Return JSON with: summary (2-3 sentences), strengths (3 items), improvements (3 items), recommendations (3 items).

Return ONLY valid JSON (no markdown):
{
  "summary": "...",
  "strengths": ["...", "...", "..."],
  "improvements": ["...", "...", "..."],
  "recommendations": ["...", "...", "..."]
}`,
      },
    ],
  });

  const text = resp.choices?.[0]?.message?.content ?? "{}";

  // Extract JSON
  let jsonStr = text;
  if (text.includes("```json")) {
    jsonStr = text.split("```json")[1].split("```")[0];
  } else if (text.includes("```")) {
    jsonStr = text.split("```")[1].split("```")[0];
  }

  const parsed = JSON.parse(jsonStr.trim());

  return {
    summary: parsed.summary,
    strengths: parsed.strengths || [],
    improvements: parsed.improvements || [],
    recommendations: parsed.recommendations || [],
  };
}

// Explainable Performance Engine - Explain WHY progress changed
export async function explainPerformanceChange(
  goalTitle: string,
  previousProgress: number,
  currentProgress: number,
  daysSinceUpdate: number,
  completionTrend: "improving" | "stable" | "declining"
): Promise<string> {
  const openai = getOpenAIClient();
  const resp = await openai.chat.completions.create({
    model: "gpt-4",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Explain why performance changed for goal: "${goalTitle}"
Previous: ${previousProgress}%
Current: ${currentProgress}%
Days since last update: ${daysSinceUpdate}
Trend: ${completionTrend}

Provide a concise, actionable explanation (2-3 sentences). Be specific about risk factors.`,
      },
    ],
  });

  return resp.choices?.[0]?.message?.content ?? "";
}

// Risk Prediction Engine
export async function predictGoalRisk(
  goalTitle: string,
  progress: number,
  daysRemaining: number,
  lastUpdated: Date
): Promise<{
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  factors: string[];
  recommendations: string[];
}> {
  const openai = getOpenAIClient();
  const daysSinceUpdate = Math.floor(
    (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
  );

  const resp = await openai.chat.completions.create({
    model: "gpt-4",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `Assess risk for goal: "${goalTitle}"
Progress: ${progress}%
Days remaining: ${daysRemaining}
Days since last update: ${daysSinceUpdate}

Rate as low/medium/high. Return JSON:
{
  "riskLevel": "high",
  "riskScore": 75,
  "factors": ["factor 1", "factor 2"],
  "recommendations": ["action 1", "action 2"]
}

Return ONLY valid JSON (no markdown):`,
      },
    ],
  });

  const text = resp.choices?.[0]?.message?.content ?? "{}";

  // Extract JSON
  let jsonStr = text;
  if (text.includes("```json")) {
    jsonStr = text.split("```json")[1].split("```")[0];
  } else if (text.includes("```")) {
    jsonStr = text.split("```")[1].split("```")[0];
  }

  const parsed = JSON.parse(jsonStr.trim());

  return {
    riskLevel: parsed.riskLevel || "medium",
    riskScore: parsed.riskScore || 50,
    factors: parsed.factors || [],
    recommendations: parsed.recommendations || [],
  };
}

// Natural Language Query Handler
export async function processNaturalLanguageQuery(
  query: string,
  context: {
    goals: Array<{ title: string; progress: number; status: string }>;
    employees: Array<{ name: string; healthScore: number }>;
  }
): Promise<string> {
  const openai = getOpenAIClient();
  const goalsContext = context.goals
    .map((g) => `- ${g.title} (${g.progress}%, ${g.status})`)
    .join("\n");
  const employeeContext = context.employees
    .map((e) => `- ${e.name} (health: ${e.healthScore})`)
    .join("\n");

  const resp = await openai.chat.completions.create({
    model: "gpt-4",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `You are an AI analytics assistant for an employee performance platform.

User Query: "${query}"

Available Data:
Goals: ${goalsContext}
Employees: ${employeeContext}

Answer the query concisely with specific data insights. Be actionable.`,
      },
    ],
  });

  return resp.choices?.[0]?.message?.content ?? "";
}

// "Why Am I Stuck" Analysis
export async function analyzeStuckGoal(
  goalTitle: string,
  description: string,
  lastThreeUpdates: Array<{ achievement: string; daysAgo: number }>,
  blockers: string[]
): Promise<{
  analysis: string;
  rootCauses: string[];
  actions: string[];
}> {
  const openai = getOpenAIClient();
  const updates = lastThreeUpdates
    .map((u) => `${u.daysAgo} days ago: ${u.achievement}`)
    .join("\n");

  const resp = await openai.chat.completions.create({
    model: "gpt-4",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Analyze why this employee is stuck on: "${goalTitle}"
Description: ${description}

Recent updates:
${updates}

Reported blockers: ${blockers.join(", ")}

Provide JSON with: analysis (2-3 sentences), rootCauses (array), actions (array)

Return ONLY valid JSON (no markdown):
{
  "analysis": "...",
  "rootCauses": ["...", "..."],
  "actions": ["...", "..."]
}`,
      },
    ],
  });

  const text = resp.choices?.[0]?.message?.content ?? "{}";

  // Extract JSON
  let jsonStr = text;
  if (text.includes("```json")) {
    jsonStr = text.split("```json")[1].split("```")[0];
  } else if (text.includes("```")) {
    jsonStr = text.split("```")[1].split("```")[0];
  }

  const parsed = JSON.parse(jsonStr.trim());

  return {
    analysis: parsed.analysis,
    rootCauses: parsed.rootCauses || [],
    actions: parsed.actions || [],
  };
}
