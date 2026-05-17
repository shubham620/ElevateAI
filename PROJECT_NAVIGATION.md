# 🗺️ ElevateAI - Project Navigation Guide

## Quick File Reference

### 🎨 **UI Components** 
Located in `components/`

```
components/
├── copilot/
│   └── ai-copilot-panel.tsx          ← Floating AI assistant (global)
├── goals/
│   ├── goal-create-dialog.tsx        ← Create goal modal
│   ├── goal-edit-dialog.tsx          ← Edit goal modal
│   └── manager-approval-panel.tsx    ← Beautiful approval workflow UI
├── activity-feed/
│   └── activity-feed.tsx             ← Timeline + feed display
├── analytics/
│   └── charts.tsx                    ← All Recharts visualizations
├── dashboard/
│   ├── nav.tsx                       ← Sidebar navigation
│   └── header.tsx                    ← Top header with user info
└── ui/
    ├── button.tsx, card.tsx, input.tsx, etc.
    └── ... 12 ShadCN base components
```

**Key Components to Explore:**
- `ai-copilot-panel.tsx` - The AI Copilot UI (best example of UX)
- `manager-approval-panel.tsx` - Approval workflow with editing
- `charts.tsx` - Complex data visualizations

---

### 🔌 **API Routes**
Located in `app/api/`

```
app/api/
├── ai/
│   └── copilot/route.ts              ← AI assistant endpoint
├── activity/route.ts                 ← Activity feed API
├── checkins/
│   ├── route.ts                      ← GET/POST check-ins
│   └── [checkinId]/route.ts          ← PUT/DELETE check-in
├── dashboard/route.ts                ← Dashboard data by role
├── health-score/route.ts             ← Health score calculation
├── goals/
│   ├── route.ts                      ← Goal CRUD
│   └── [goalId]/route.ts             ← Goal detail + approve
└── auth/
    └── [...nextauth]/route.ts        ← Authentication
```

**Key APIs to Understand:**
- `/api/ai/copilot` - AI endpoint with intent detection
- `/api/health-score` - 5-factor health calculation
- `/api/checkins` - Quarterly check-in system
- `/api/activity` - Activity feed with pagination

---

### 📄 **Pages/Routes**
Located in `app/`

```
app/
├── page.tsx                          ← Landing page (public)
├── layout.tsx                        ← Root layout
├── globals.css                       ← Global styles
├── auth/
│   ├── signin/page.tsx              ← Sign-in page
│   └── signup/page.tsx              ← Sign-up page
└── dashboard/
    ├── layout.tsx                    ← Dashboard wrapper (+AI copilot)
    ├── page.tsx                      ← Redirect to role dashboard
    ├── employee/page.tsx             ← Employee dashboard ⭐
    ├── manager/page.tsx              ← Manager dashboard ⭐
    ├── admin/page.tsx                ← Admin dashboard
    ├── analytics/page.tsx            ← Full analytics page
    ├── goals/page.tsx                ← Goal management
    └── settings/page.tsx             ← User settings
```

**Pages to Explore:**
- `dashboard/employee/page.tsx` - Shows all employee features
- `dashboard/manager/page.tsx` - Shows approval workflow
- `analytics/page.tsx` - Full dashboard with charts

---

### 🧠 **Service Layers**
Located in `lib/`

```
lib/
├── openai.ts                         ← AI service layer ⭐
│   ├── generateSmartGoal()
│   ├── analyzeGoalQuality()
│   ├── generatePerformanceReview()
│   ├── explainPerformanceChange()
│   ├── predictGoalRisk()
│   ├── processNaturalLanguageQuery()
│   └── analyzeStuckGoal()
├── score.ts                          ← Health score service ⭐
│   ├── calculateWorkHealthScore()
│   ├── getHealthScoreTrend()
│   └── getTeamHealthScores()
├── activity.ts                       ← Activity logging service ⭐
│   ├── logActivity()
│   ├── getActivityFeed()
│   ├── captureGoalChange()
│   └── Socket.io setup hooks
├── auth.ts                           ← NextAuth configuration
├── prisma.ts                         ← Prisma singleton
├── api.ts                            ← API client utilities
└── utils.ts                          ← Helper functions
```

**Key Services to Understand:**
- `openai.ts` - All 7 AI capabilities with prompt engineering
- `score.ts` - How health score is calculated
- `activity.ts` - Event logging & audit trail

---

### 🗄️ **Database**
Located in `prisma/`

```
prisma/
├── schema.prisma                     ← Database schema (7 models)
│   ├── User                          ← Employees, managers, admins
│   ├── Goal                          ← Performance goals
│   ├── QuarterlyCheckin              ← Progress updates
│   ├── Notification                  ← Real-time alerts
│   ├── ActivityLog                   ← Audit trail
│   ├── AIInsight                     ← AI-generated insights
│   └── ... more models
└── seed.ts                           ← Demo data seeding
```

---

### 📚 **TypeScript Types**
Located in `types/`

```
types/
└── index.ts
    ├── User, Goal, Notification types
    ├── API request/response types
    ├── Activity types
    └── ... all TypeScript definitions
```

---

### 🎣 **Custom Hooks**
Located in `hooks/`

```
hooks/
└── use-toast.ts                      ← Toast notifications hook
```

---

### 📖 **Documentation Files**

```
Root Level:
├── README.md                         ← Project overview
├── DEVELOPMENT.md                    ← Architecture & patterns
├── ARCHITECTURE.md                   ← System design deep-dive
├── COMPLETION_ASSESSMENT.md          ← Feature status
├── COMPLETE_DEMO_GUIDE.md            ← Comprehensive guide (THIS ONE)
├── BUILD_SUMMARY.md                  ← Build completion summary
└── PROJECT_SUMMARY.md                ← Original summary
```

---

## 🎯 How to Navigate by Feature

### **I want to understand the AI**
1. Read: `lib/openai.ts` - See all AI prompts
2. Check: `app/api/ai/copilot/route.ts` - See intent routing
3. Try: Click copilot button and test

### **I want to understand health scoring**
1. Read: `lib/score.ts` - See calculation logic
2. Check: `app/api/health-score/route.ts` - See endpoint
3. Try: Employee dashboard to see health breakdown

### **I want to understand the approval workflow**
1. Read: `components/goals/manager-approval-panel.tsx` - UI
2. Check: `app/dashboard/manager/page.tsx` - Integration
3. Try: Login as manager, see pending goals

### **I want to understand activity logging**
1. Read: `lib/activity.ts` - See logging service
2. Check: `components/activity-feed/activity-feed.tsx` - UI
3. Try: Perform actions and see in activity feed

### **I want to understand the analytics**
1. Read: `components/analytics/charts.tsx` - Chart components
2. Check: Data generation functions at bottom
3. Try: Visit analytics page to see all charts

### **I want to add a new feature**
1. Check: `DEVELOPMENT.md` - See patterns
2. Look at: Similar existing feature
3. Follow: Same structure and patterns

---

## 🚀 Quick Start Checklist

- [ ] Run `npm install`
- [ ] Set up `.env.local` with:
  - `DATABASE_URL` (PostgreSQL)
  - `OPENAI_API_KEY`
  - `NEXTAUTH_SECRET`
- [ ] Run `npx prisma db push`
- [ ] Run `npm run db:seed`
- [ ] Run `npm run dev`
- [ ] Visit `http://localhost:3000`
- [ ] Login with demo account
- [ ] Explore each feature
- [ ] Read the documentation

---

## 💡 Best Code Examples

**To learn from:**

1. **AI Integration** → `lib/openai.ts`
   - See how to structure AI prompts
   - Error handling patterns
   - JSON parsing from AI

2. **Service Layer Pattern** → `lib/activity.ts`
   - Modular service design
   - Database operations
   - Real-time hooks setup

3. **React Component** → `components/copilot/ai-copilot-panel.tsx`
   - Framer Motion animations
   - Complex state management
   - Message handling
   - Responsive design

4. **API Route** → `app/api/ai/copilot/route.ts`
   - Authentication
   - Intent detection
   - Service layer usage
   - Error handling

5. **Dashboard** → `app/dashboard/employee/page.tsx`
   - Component composition
   - API fetching
   - Loading states
   - Animations

6. **Data Visualization** → `components/analytics/charts.tsx`
   - Recharts patterns
   - Data transformation
   - Multiple chart types
   - Responsive layouts

---

## 🎓 Learning Path

**Beginner:**
1. Start → `app/page.tsx` (landing page)
2. Explore → `app/auth/` (authentication)
3. Understand → `types/index.ts` (data types)

**Intermediate:**
1. Study → `app/dashboard/employee/page.tsx` (dashboard)
2. Analyze → `components/ui/` (reusable components)
3. Review → `lib/utils.ts` (helper functions)

**Advanced:**
1. Deep dive → `lib/openai.ts` (AI integration)
2. Master → `lib/score.ts` (business logic)
3. Understand → `lib/activity.ts` (architecture)

**Expert:**
1. Architecture → `app/api/` (all endpoints)
2. Patterns → `DEVELOPMENT.md` (patterns guide)
3. Design → `ARCHITECTURE.md` (system design)

---

## 🔍 File Size Reference

| File | Size | Importance |
|------|------|-----------|
| `lib/openai.ts` | 400 lines | ⭐⭐⭐ |
| `lib/score.ts` | 300 lines | ⭐⭐⭐ |
| `lib/activity.ts` | 250 lines | ⭐⭐⭐ |
| `components/copilot/ai-copilot-panel.tsx` | 350 lines | ⭐⭐⭐ |
| `components/goals/manager-approval-panel.tsx` | 300 lines | ⭐⭐⭐ |
| `components/analytics/charts.tsx` | 400 lines | ⭐⭐ |
| `app/dashboard/employee/page.tsx` | 280 lines | ⭐⭐ |
| `app/dashboard/manager/page.tsx` | 320 lines | ⭐⭐ |

---

## 📊 Project Statistics

- **Total Files**: 50+
- **React Components**: 30+
- **API Routes**: 12+
- **Service Modules**: 3
- **TypeScript Files**: 40+
- **UI Components**: 12+
- **Lines of Code**: 8,000+
- **Features**: 45+

---

## 🎯 Where to Start Reading

**Priority Order:**

1. **BUILD_SUMMARY.md** - Overview (5 min read)
2. **COMPLETE_DEMO_GUIDE.md** - Feature breakdown (10 min read)
3. **lib/openai.ts** - AI integration (15 min read)
4. **components/copilot/ai-copilot-panel.tsx** - UI Pattern (10 min read)
5. **app/api/ai/copilot/route.ts** - Backend Pattern (10 min read)
6. **DEVELOPMENT.md** - Architecture patterns (20 min read)

---

## ✨ Pro Tips

- **Copy patterns** from existing code
- **Use TypeScript** for new files
- **Follow component structure** for consistency
- **Test in browser** after changes
- **Check console** for helpful error messages
- **Read comments** in service layers
- **Explore dashboards** for usage examples

---

## 🆘 Common Questions

**Q: Where do I start?**
A: Run `npm run dev` and login. Then read this guide.

**Q: How does the AI work?**
A: Check `lib/openai.ts` for all prompts and logic.

**Q: How do I add a feature?**
A: Copy an existing feature and modify it.

**Q: Where's the database schema?**
A: `prisma/schema.prisma` has everything.

**Q: How do I deploy?**
A: See DEVELOPMENT.md deployment section.

**Q: Can I use this commercially?**
A: Yes, this is a demo for you to customize.

---

## 🚀 Next Steps

1. **Understand the structure** - Read this guide
2. **Run the application** - `npm run dev`
3. **Test all features** - Use demo accounts
4. **Read the code** - Start with BUILD_SUMMARY.md
5. **Customize it** - Add your own features
6. **Deploy it** - Share with the world!

---

## 📞 Need Help?

**Check these first:**
- README.md - Overview
- DEVELOPMENT.md - Development guide  
- ARCHITECTURE.md - System design
- COMPLETE_DEMO_GUIDE.md - Feature guide
- Code comments - Inline documentation

**Then explore:**
- Similar files for patterns
- Test files for examples
- Documentation files for context

---

**Happy coding! 🎉**

**Now go explore ElevateAI!**

