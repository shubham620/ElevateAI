# 🚀 ElevateAI - Getting Started Guide

## ✅ Current Status

The project has been fixed and is now **BUILD COMPLETE** with end-to-end functionality working!

### What's Working Now:
- ✅ Next.js 15 app structure
- ✅ TypeScript compilation (all type errors fixed)
- ✅ Authentication system with 3 demo roles
- ✅ Goal management system
- ✅ Quarterly check-ins
- ✅ Manager approval workflows
- ✅ AI Copilot (intelligent fallbacks)
- ✅ Analytics charts
- ✅ Activity feed
- ✅ Work health scoring
- ✅ Database schema (Prisma + PostgreSQL)

---

## 📋 Prerequisites

Before you start, ensure you have:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 12+** ([Download](https://www.postgresql.org/) or use [PostgreSQL App](https://www.pgadmin.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

---

## 🔧 Installation & Setup

### Step 1: Install Dependencies

```bash
cd ElevateAI
npm install
```

### Step 2: Set Up Environment Variables

The `.env.local` file has been created with defaults. Update it with your actual values:

```bash
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/elevateai"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="elevateai-development-secret-key-change-in-production"

# OpenAI API (Optional - for enhanced AI features)
OPENAI_API_KEY="sk-your-key-here"

# Environment
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

**For PostgreSQL Connection:**
- **Host:** localhost
- **Port:** 5432
- **User:** postgres
- **Password:** postgres (or your setup)
- **Database:** elevateai

### Step 3: Create PostgreSQL Database

```bash
# Using psql:
createdb elevateai

# Or using pgAdmin GUI:
# 1. Open pgAdmin
# 2. Right-click "Databases" → Create → Database
# 3. Name it "elevateai"
```

### Step 4: Run Database Migrations

```bash
npx prisma db push
```

This will:
- Create all tables based on the schema
- Set up relationships
- Create indexes

### Step 5: Seed Demo Data

```bash
npm run db:seed
```

This will create:
- **Admin account:** admin@elevateai.com / password123
- **Manager account:** manager@elevateai.com / password123
- **Employee account:** employee@elevateai.com / password123
- **Sample goals** for demo purposes
- **Sample check-ins** and activity logs

### Step 6: Start Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

---

## 🎯 Demo Accounts

After seeding, you can login with:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@elevateai.com | password123 |
| **Manager** | manager@elevateai.com | password123 |
| **Employee** | employee@elevateai.com | password123 |

---

## 📱 Testing the App

### Employee Workflow:
1. ✅ Login as `employee@elevateai.com`
2. ✅ Go to **Goals** → Create a new goal
3. ✅ Edit goal details before submitting
4. ✅ Submit goal for approval
5. ✅ Go to **Check-ins** → Submit quarterly updates
6. ✅ View **Analytics** dashboard

### Manager Workflow:
1. ✅ Login as `manager@elevateai.com`
2. ✅ Go to **Dashboard** → See team members
3. ✅ Review pending approvals
4. ✅ Approve/reject employee goals
5. ✅ View team performance analytics
6. ✅ Review quarterly check-ins

### Admin Workflow:
1. ✅ Login as `admin@elevateai.com`
2. ✅ Go to **Admin Dashboard** → Organization-wide analytics
3. ✅ View all users and departments
4. ✅ Monitor system-wide goal completion rates
5. ✅ View risk analytics

### AI Copilot:
- Click the **floating AI button** (bottom-right)
- Try these prompts:
  - "Generate a goal for improving customer satisfaction"
  - "Analyze my performance"
  - "Which of my goals are at risk?"
  - "Show delayed Q2 goals"

---

## 🔌 Optional: AI Features Setup

To enable full AI capabilities (beyond the intelligent fallbacks):

### Get OpenAI API Key:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or login
3. Create an API key
4. Update `.env.local`:
   ```bash
   OPENAI_API_KEY="sk-your-actual-key"
   ```

### Features Enhanced with API:
- ✨ SMART goal generation from natural language
- ✨ Goal quality analysis
- ✨ AI-powered performance review generation
- ✨ Risk prediction with recommendations
- ✨ Natural language analytics queries

**Note:** Without the API key, the app still works with intelligent fallbacks and mock AI responses.

---

## 📚 Useful Commands

```bash
# Development
npm run dev                 # Start dev server

# Production
npm run build              # Build for production
npm start                  # Start production server

# Database
npm run db:push            # Sync database with schema
npm run db:seed            # Seed demo data
npm run db:studio          # Open Prisma Studio (GUI for data)

# Linting
npm run lint               # Run ESLint
npm run type-check         # TypeScript type checking

# Clean
rm -r .next node_modules   # Hard reset (if needed)
npm install                # Reinstall everything
```

---

## 🗂️ Project Structure

```
ElevateAI/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── auth/               # Authentication
│   │   ├── goals/              # Goal CRUD operations
│   │   ├── checkins/           # Quarterly check-ins
│   │   ├── ai/                 # AI Copilot endpoints
│   │   └── dashboard/          # Dashboard data
│   ├── auth/                   # Auth pages (signin, signup)
│   └── dashboard/              # Dashboard pages
│       ├── employee/           # Employee dashboard
│       ├── manager/            # Manager dashboard
│       ├── admin/              # Admin dashboard
│       ├── goals/              # Goal management
│       ├── checkins/           # Check-in page
│       └── analytics/          # Analytics dashboard
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── goals/                  # Goal components
│   ├── checkins/               # Check-in components
│   ├── copilot/                # AI Copilot component
│   ├── analytics/              # Charts components
│   └── dashboard/              # Dashboard components
├── lib/
│   ├── auth.ts                 # NextAuth configuration
│   ├── openai.ts               # AI service layer
│   ├── prisma.ts               # Prisma client
│   ├── activity.ts             # Activity logging
│   ├── score.ts                # Health score calculation
│   ├── api.ts                  # API utilities
│   └── utils.ts                # Helper functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.js                 # Demo data seed
└── types/
    └── index.ts                # TypeScript type definitions
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or specify a different port
npm run dev -- -p 3001
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
# macOS: brew services start postgresql
# Windows: Start PostgreSQL from services
# Linux: sudo service postgresql start

# Verify connection string
echo $DATABASE_URL  # Check the value

# Try connecting directly
psql -U postgres -d elevateai
```

### Prisma Schema Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Format schema
npx prisma format
```

### Authentication Not Working
```bash
# Regenerate auth secret
openssl rand -base64 32

# Update NEXTAUTH_SECRET in .env.local
# Restart dev server
```

### Build Fails
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Deploy to Other Platforms

```bash
npm run build
npm start
```

Then deploy the `.next` and `public` folders.

---

## 📖 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload

### Building
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - TypeScript type checking

### Database
- `npm run db:push` - Sync schema with database
- `npm run db:seed` - Populate database with demo data
- `npm run db:studio` - Open Prisma Studio GUI

### Code Quality
- `npm run lint` - Run ESLint

---

## 🎯 Key Features Implemented

### ✅ Authentication
- NextAuth.js with credentials provider
- 3 role-based access levels (Employee, Manager, Admin)
- Secure password hashing with bcryptjs
- Session management

### ✅ Goal Management
- Create, edit, delete goals
- Goal validation (max 8 per employee, weightage sum = 100%)
- Manager approval workflow
- Goal locking mechanism
- Shared/departmental goals

### ✅ Quarterly Check-ins
- Employee progress updates
- Status tracking (Not Started, On Track, Completed)
- Manager review and feedback
- Progress visualization

### ✅ AI Copilot
- Intelligent goal generation
- Performance analysis
- Risk detection
- Natural language queries
- Contextual help

### ✅ Analytics Dashboard
- Productivity trends
- Completion rate charts
- Risk distribution
- Department comparison
- Health score trends

### ✅ Real-time Features
- Activity feed with polling
- Notifications
- Live dashboards
- Activity logging

### ✅ Work Health Score
- Consistency metrics
- Completion rate
- Engagement tracking
- Productivity analysis
- Deadline discipline

---

## 🚀 Next Steps

1. **Login** and explore the app
2. **Create goals** as an employee
3. **Approve goals** as a manager
4. **Submit check-ins** for quarterly reviews
5. **Review analytics** for insights
6. **Interact with AI Copilot** for smart recommendations

---

## 📞 Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [README.md](./README.md) for more details
3. Check Next.js docs: https://nextjs.org/docs
4. Check Prisma docs: https://www.prisma.io/docs/

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Happy coding! 🎉**

Built with ❤️ for performance management excellence.
