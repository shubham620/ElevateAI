## 🏗️ Architecture & Development Guide

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Next.js 15)                   │
│  - React Components (TypeScript)                         │
│  - Form Management (React Hook Form + Zod)               │
│  - State Management (Custom hooks + React Context)       │
│  - Charts & Visualization (Recharts)                     │
│  - Styling (Tailwind CSS + Framer Motion)                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTP / NextAuth Sessions
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Next.js API Routes)                │
│  - Authentication (NextAuth + JWT)                       │
│  - Goal Management APIs                                  │
│  - Dashboard Data APIs                                   │
│  - AI Integration APIs                                   │
│  - Approval Workflows                                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ Prisma ORM
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Database (PostgreSQL)                        │
│  - Users, Goals, Checkins                                │
│  - Notifications, Activity Logs                          │
│  - AI Insights                                           │
└─────────────────────────────────────────────────────────┘
```

### User Flow & Authentication

```
User Visit
   └─> /page.tsx (Landing)
       │
       ├─> Authentication Check
       │   └─> Authenticated? → /dashboard
       │   └─> Not Auth? → Show Landing Page
       │
       ├─> Sign In Flow
       │   └─> /auth/signin → NextAuth → Session Created
       │
       └─> Sign Up Flow
           └─> /auth/signup → POST /api/auth/register → NextAuth
```

### Database Schema Relationships

```
User (1) ──────────────┐
  │                    │
  ├─> many Goals       │
  ├─> many Notifications
  │                Employee
  ├─> many ActivityLogs │
  │                    │
  └─> many AIInsights Manager (1:Many)
                       │
Goal (1) ──────────────┤
  │                    │
  ├─> many QuarterlyCheckins
  ├─> many GoalComments
  └─> many ActivityLogs
```

### Component Hierarchy

```
RootLayout
├─> Providers (SessionProvider)
├─> page.tsx (Landing)
├─> auth/
│   ├─> signin/page.tsx
│   └─> signup/page.tsx
└─> dashboard/
    ├─> layout.tsx
    │   ├─> DashboardNav
    │   ├─> DashboardHeader
    │   └─> Main Content
    ├─> page.tsx (Redirector)
    ├─> employee/
    │   └─> page.tsx (Dashboard)
    ├─> manager/
    │   └─> page.tsx (Dashboard)
    ├─> admin/
    │   └─> page.tsx (Dashboard)
    ├─> goals/
    │   └─> page.tsx
    └─> analytics/
        └─> page.tsx
```

---

## 🔐 Authentication Flow

### Session Management
1. User submits credentials
2. NextAuth validates against database (bcryptjs password check)
3. JWT token created and stored in session
4. Session stored in middleware/headers
5. Protected routes check session with `getServerSession()`

### Role-Based Access Control (RBAC)
```typescript
// Roles: EMPLOYEE | MANAGER | ADMIN

// Route Protection Example
if (userRole === "MANAGER") {
  // Show manager-specific UI
} else if (userRole === "EMPLOYEE") {
  // Show employee UI
}

// API Protection Example
if (userRole !== "ADMIN" && userRole !== "MANAGER") {
  return 403 Forbidden
}
```

---

## 📊 Business Logic

### Goal Approval Workflow

```
Employee Creates Goal (DRAFT)
        ↓
Employee Submits (SUBMITTED)
        ↓
Manager Reviews
        ├─> Approves → APPROVED (Locked)
        ├─> Rejects → REJECTED (Can Edit)
        └─> Requests Changes → REWORK
        ↓
Employee Updates Progress Quarterly
        ↓
AI Analyzes & Generates Insights
        ↓
Manager Reviews Progress & Comments
        ↓
At Quarter End → Review Generated
```

### Weightage Validation
- Each goal: 10% - 100%
- Total across all goals: Must be 100%
- Maximum 8 goals per employee
- Enforced client-side and server-side

### Risk Calculation
```
A goal is AT RISK if:
- Days remaining < 30 AND
- Current progress < 80% of target

Example:
- Target: 100
- Current: 70 (70%)
- Days Left: 15
- Result: AT RISK ⚠️
```

---

## 🤖 AI Integration

### OpenAI API Integration

```typescript
// Generate SMART Goal
POST /api/ai/generate-goal
Input: { input: "Improve customer support" }
Output: {
  title: "Professional goal",
  description: "SMART-formatted description",
  kpiType: "Metric type",
  target: 92,
  smartScore: 85,
  suggestions: ["suggestion1", "suggestion2"]
}
```

### Prompt Engineering
The AI receives context about:
- Current goals
- Performance history
- Team benchmarks
- Industry standards

---

## 📁 File Organization

### `/app` - Next.js App Router
- Page components (`.tsx`)
- Layouts
- API routes (`/api/**/route.ts`)
- Server components by default

### `/components` - Reusable Components
- `/ui` - Base UI (ShadCN)
- `/dashboard` - Dashboard components
- `/goals` - Goal-specific components

### `/lib` - Utilities & Services
- `auth.ts` - NextAuth configuration
- `prisma.ts` - Prisma client singleton
- `utils.ts` - Helper functions
- `api.ts` - API client functions

### `/types` - TypeScript Definitions
- Reusable interfaces
- Database model types
- API response types

### `/prisma` - Database
- `schema.prisma` - Database schema
- `seed.ts` - Demo data seeding

---

## 🚀 Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate new `NEXTAUTH_SECRET`
- [ ] Configure PostgreSQL production database
- [ ] Run `npx prisma db push` on production database
- [ ] Set `NEXT_PUBLIC_API_URL` to production domain
- [ ] Configure OpenAI API key
- [ ] Set up environment variables on hosting platform
- [ ] Run `npm run build`
- [ ] Test authentication flows
- [ ] Verify API endpoints
- [ ] Set up database backups
- [ ] Configure CORS if needed

---

## 🔧 Common Tasks

### Add New API Endpoint

```typescript
// app/api/features/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  // 1. Check Authentication
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // 2. Validate Input
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  
  // 3. Database Query
  const data = await prisma.model.findUnique({ where: { id } })

  // 4. Return Response
  return NextResponse.json(data)
}
```

### Add New Page Component

```typescript
// app/dashboard/new-page/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { apiGet } from "@/lib/api"

export default function NewPageComponent() {
  const { data: session } = useSession()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await apiGet("/api/endpoint")
        setData(result)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div>
      {/* Your UI here */}
    </div>
  )
}
```

### Add New Database Model

```prisma
model NewModel {
  id        String   @id @default(cuid())
  title     String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

Then:
1. Update `schema.prisma`
2. Run `npx prisma db push`
3. Regenerate types if needed

---

## 🐛 Debugging

### Enable Prisma Logging
```typescript
const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
})
```

### Check NextAuth Session
```typescript
const session = await getServerSession(authOptions)
console.log("Current session:", session)
```

### API Request Debugging
```typescript
// In API route
console.log("Request method:", request.method)
console.log("Headers:", request.headers)
console.log("Body:", await request.json())
```

---

## 📈 Performance Tips

1. **Database Queries**
   - Use `include` and `select` for specific fields
   - Avoid N+1 queries
   - Use indexes on frequently queried fields

2. **Frontend**
   - Lazy load components with `React.lazy()`
   - Use `useMemo` for expensive calculations
   - Optimize images with Next.js Image component
   - Code split at page level (automatic)

3. **Caching**
   - Use SWR or React Query for data fetching
   - Cache API responses appropriately
   - Implement stale-while-revalidate patterns

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Happy coding! 🚀**
