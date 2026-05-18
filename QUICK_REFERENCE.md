# 🚀 ElevateAI - Quick Reference Card

## ⚡ Quick Start

```bash
# Start development server (already running)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Access App:** http://localhost:3000

---

## 🎮 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@elevateai.com | password123 |
| Manager | manager@elevateai.com | password123 |
| Employee | employee@elevateai.com | password123 |

---

## 📋 Database Commands

```bash
# Sync database schema
npm run db:push

# Seed demo data
npm run db:seed

# Open Prisma Studio (GUI)
npm run db:studio

# View database file
dev.db  (SQLite file in project root)
```

---

## 🔍 Development Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# All checks
npm run type-check && npm run lint
```

---

## 📁 Important Directories

```
app/
  ├── api/           → Backend API routes
  ├── auth/          → Login/signup pages
  └── dashboard/     → Main app pages

components/         → React components
lib/               → Utility functions & services
prisma/            → Database schema & seed
types/             → TypeScript types
```

---

## 🛠️ Key Features Available

- ✅ Goal Management (Create, Edit, Delete, Approve)
- ✅ Quarterly Check-ins (Track progress)
- ✅ Role-based Dashboards (Employee/Manager/Admin)
- ✅ Analytics & Insights
- ✅ AI Copilot (Click button in bottom-right)
- ✅ Activity Feed & Notifications
- ✅ Work Health Scoring

---

## ⚙️ Environment Variables (.env.local)

```
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=elevateai-development-secret-key-change-in-production
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
OPENAI_API_KEY=sk-your-key-here (optional)
```

---

## 🐛 Troubleshooting

**Port 3000 in use:**
```bash
npx kill-port 3000
npm run dev
```

**Clear cache & rebuild:**
```bash
rm -rf .next
npm run dev
```

**Reset database:**
```bash
rm dev.db
npm run db:push
npm run db:seed
```

**Type errors:**
```bash
npm run type-check
```

---

## 📱 What to Try

1. **Login** → Use any demo account
2. **Create Goal** → As employee, create a new goal
3. **Submit Goal** → Submit for manager approval
4. **Approve Goal** → As manager, review and approve
5. **Submit Check-in** → Track quarterly progress
6. **View Analytics** → Check dashboards
7. **Use AI** → Click floating button (bottom-right)

---

## 📊 Technology Stack

- **Frontend**: React 18 + Next.js 15 + TypeScript
- **UI**: Radix UI + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (Prisma ORM)
- **Auth**: NextAuth.js
- **State**: Zustand

---

## 📚 Documentation

- `ENVIRONMENT_SETUP.md` - Setup details
- `GETTING_STARTED.md` - Getting started guide
- `README.md` - Project overview
- `ARCHITECTURE.md` - System architecture

---

## ✨ Status

✅ **Database**: SQLite configured and seeded  
✅ **Backend**: API routes ready  
✅ **Frontend**: All pages built  
✅ **Types**: TypeScript checking passing  
✅ **Build**: Production build successful  
✅ **Server**: Running on http://localhost:3000  

**Ready to develop! 🎉**
