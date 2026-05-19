import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "employee@elevateai.com" },
    })

    if (!user) {
      return Response.json({ error: "User not found" })
    }

    const isValid = await bcrypt.compare("password123", user.password)

    return Response.json({
      userFound: true,
      email: user.email,
      passwordHash: user.password.substring(0, 30),
      passwordValid: isValid,
    })
  } catch (error) {
    return Response.json({ error: String(error) })
  }
}