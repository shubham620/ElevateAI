// app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const userRole = (session.user as any).role

  if (userRole === "EMPLOYEE") {
    redirect("/dashboard/employee")
  } else if (userRole === "MANAGER") {
    redirect("/dashboard/manager")
  } else if (userRole === "ADMIN") {
    redirect("/dashboard/admin")
  }

  redirect("/auth/signin")
}
