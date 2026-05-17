// app/page.tsx
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Brain, Users, Zap, Shield, Rocket } from "lucide-react"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // Redirect authenticated users to their dashboard
  if (session?.user?.id) {
    redirect("/dashboard")
  }

  const features = [
    {
      icon: BarChart3,
      title: "Smart Goal Tracking",
      description: "Set SMART goals with AI assistance and track progress in real-time",
    },
    {
      icon: Brain,
      title: "AI Copilot",
      description: "Get intelligent insights, predictions, and recommendations powered by OpenAI",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Managers can approve goals, provide feedback, and monitor team performance",
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Instant notifications and live dashboards keep everyone in sync",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Role-based access control, encrypted sessions, and audit logging",
    },
    {
      icon: Rocket,
      title: "Performance Analytics",
      description: "Visualize trends, identify risks, and optimize team productivity",
    },
  ]

  const stats = [
    { label: "Organizations", value: "500+" },
    { label: "Active Users", value: "10K+" },
    { label: "Goals Tracked", value: "100K+" },
    { label: "Uptime", value: "99.9%" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white text-sm font-bold">
              E
            </div>
            <span>ElevateAI</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-primary/10 to-secondary/10 py-20 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              AI-Powered Performance Intelligence Platform
            </h1>
            <p className="text-lg text-muted-foreground">
              Elevate your team's performance with intelligent goal management, AI insights, and real-time collaboration. Transform how you track and manage employee goals.
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground pt-4">
              Demo accounts available. <Link href="/auth/signin" className="text-primary hover:underline">Sign in with demo creds</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Powerful Features</h2>
            <p className="text-muted-foreground mt-2">Everything you need to manage performance goals effectively</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <Card key={i} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 px-4 text-white">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to elevate your team?</h2>
          <p className="mb-8 opacity-90">
            Join thousands of organizations using ElevateAI to transform their performance management process
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4 mt-auto">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground">Docs</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ElevateAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
