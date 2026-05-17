import { getServerSession } from "next-auth/next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default async function UsersPage() {
  const session = await getServerSession(auth)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  if ((session.user as any).role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-2">Admin user management and organization controls.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin User Management</CardTitle>
          <CardDescription>
            This admin view is available at `/dashboard/users`. You can extend it with a user list, search, and role controls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            There is currently no dedicated user management UI yet, but this page now resolves correctly instead of showing a 404.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
