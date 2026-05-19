// app/api/ai/generate-goal/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { input } = await request.json()

    if (!input) {
      return NextResponse.json(
        { message: "Input is required" },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: "AI feature is not configured. Please set OPENAI_API_KEY." },
        { status: 503 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `You are an expert performance management consultant. Convert this rough goal idea into a professional SMART goal.

Input: "${input}"

Generate a JSON response with these fields:
{
  "title": "Professional goal title",
  "description": "Detailed SMART description",
  "thrustArea": "Strategic focus area",
  "kpiType": "Type of KPI",
  "target": numeric_value,
  "smartScore": score_out_of_100,
  "suggestions": ["suggestion 1", "suggestion 2"]
}

Only respond with valid JSON, no additional text.`

    const message = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    const content = message.choices[0]?.message?.content || ""
    const goalData = JSON.parse(content)

    return NextResponse.json(goalData)
  } catch (error) {
    console.error("AI generate-goal error:", error)
    return NextResponse.json(
      { message: "Failed to generate goal" },
      { status: 500 }
    )
  }
}
