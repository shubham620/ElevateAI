# ⚡ ElevateAI - Quick Start (5 Minutes)

## 🎯 Fast Setup

### Prerequisites:
- Node.js 18+ installed
- PostgreSQL running locally
- Git installed

### Commands (Copy & Paste):

```bash
# 1. Clone and enter directory
cd ElevateAI

# 2. Install dependencies (1-2 min)
npm install

# 3. Create database
createdb -U postgres elevateai

# 4. Setup database schema
npx prisma db push

# 5. Seed demo data
npm run db:seed

# 6. Start development server
npm run dev
```

Visit: **http://localhost:3000**

---

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Employee | employee@elevateai.com | password123 |
| Manager | manager@elevateai.com | password123 |
| Admin | admin@elevateai.com | password123 |

---

## 🧪 Test Workflow (2 Minutes)

### As Employee:
1. Login → Go to **Goals** → **Create Goal**
2. Fill in form → **Submit for Approval**

### As Manager:
1. Logout & login as manager
2. Go to **Dashboard** → See pending approvals
3. Click a goal → **Approve**

### As Employee Again:
1. Logout & login back
2. Go to **Check-ins** → **Submit Check-in**
3. View **Analytics** dashboard

---

## 🎨 Explore Features

- **Dashboard:** Overview of goals and metrics
- **Goals:** Create and manage goals
- **Check-ins:** Quarterly progress updates
- **Analytics:** Performance charts
- **AI Copilot:** Click floating button (bottom-right)
- **Settings:** User preferences

---

## 🆘 Troubleshooting

### Port already in use?
```bash
npx kill-port 3000
npm run dev
```

### Database connection failed?
```bash
# Check connection string in .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/elevateai"

# Restart PostgreSQL
# Then retry: npm run dev
```

### Build errors?
```bash
rm -rf node_modules .next
npm install
npm run build
```

---

## 📚 Full Documentation

- **GETTING_STARTED.md** - Detailed setup guide
- **DATABASE_SETUP.md** - Database configuration
- **COMPLETION_REPORT.md** - What was fixed
- **EXECUTIVE_SUMMARY.md** - Project overview
- **README.md** - Project details

---

**Ready? Start with: `npm run dev` 🚀**
