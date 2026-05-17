# 🗄️ Database Setup Guide - ElevateAI

Complete guide to setting up PostgreSQL and initializing the database for ElevateAI.

---

## 📋 Prerequisites

- PostgreSQL 12 or higher installed and running
- psql command-line tool (comes with PostgreSQL)
- Node.js 18+ and npm

---

## 🔍 Check PostgreSQL Installation

### Check if PostgreSQL is installed:

**Windows (PowerShell):**
```powershell
psql --version
```

**macOS (Terminal):**
```bash
psql --version
```

**Linux (Terminal):**
```bash
psql --version
```

If you see a version number, PostgreSQL is installed. Otherwise, download from [postgresql.org](https://www.postgresql.org/download/).

---

## ▶️ Start PostgreSQL Service

### Windows:
1. Open **Services** (services.msc)
2. Find "PostgreSQL 13" or similar
3. Right-click → **Start** (if stopped)
4. Or use PostgreSQL pgAdmin GUI

### macOS (with Homebrew):
```bash
brew services start postgresql
```

### macOS (without Homebrew):
- Launch **PostgreSQL** app from Applications
- Or use **pgAdmin** from Applications

### Linux (Debian/Ubuntu):
```bash
sudo service postgresql start
# or
sudo systemctl start postgresql
```

### Linux (Fedora/RHEL):
```bash
sudo systemctl start postgresql
```

---

## 🗄️ Create Database

### Method 1: Using psql (Command Line)

```bash
# Connect to PostgreSQL (uses default postgres user)
psql -U postgres

# Inside psql terminal, create database:
CREATE DATABASE elevateai;

# Verify creation:
\l

# Exit psql:
\q
```

### Method 2: Using pgAdmin (GUI)

1. Open pgAdmin
2. Expand **Servers** on left sidebar
3. Right-click **Databases** → **Create** → **Database**
4. Name: `elevateai`
5. Click **Save**

---

## 🔐 Set PostgreSQL Credentials

### Default Setup (Development):
```
Host: localhost
Port: 5432
User: postgres
Password: (your password set during installation)
Database: elevateai
```

### Update .env.local:
```bash
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/elevateai"
```

Example:
```bash
# If password is "mypassword"
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/elevateai"

# If no password (might be case for some installations)
DATABASE_URL="postgresql://postgres@localhost:5432/elevateai"
```

---

## 🔄 Initialize Database Schema

From the ElevateAI project directory:

### Step 1: Push Prisma Schema
```bash
npx prisma db push
```

This will:
- Create all tables
- Set up relationships
- Create indexes
- Validate schema

Expected output:
```
🚀  3 migrations found in prisma/migrations
✔ Enabled Preview Features for shadow database
✔ Schema pushed to the database
```

### Step 2: Seed Demo Data
```bash
npm run db:seed
```

This will create:
- 1 Admin user
- 1 Manager user
- 2 Employee users
- 10+ demo goals
- Sample check-ins
- Activity logs

Expected output:
```
✅ Seed successful!

📝 Demo Accounts:
Admin: admin@elevateai.com / password123
Manager: manager@elevateai.com / password123
Employee: employee@elevateai.com / password123
```

---

## 🔍 Verify Database

### Using psql:
```bash
# Connect to database
psql -U postgres -d elevateai

# List all tables
\dt

# View table structure
\d "User"
\d "Goal"
\d "QuarterlyCheckin"

# Count records
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Goal";

# Exit
\q
```

### Using Prisma Studio (GUI):
```bash
npm run db:studio
```

This opens a web interface at http://localhost:5555 where you can:
- View all tables
- Browse records
- Create/edit/delete data
- Export data

---

## 🔑 Database Tables Overview

### User Table
```sql
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL (hashed),
  role ENUM (EMPLOYEE, MANAGER, ADMIN),
  department TEXT,
  avatar TEXT,
  managerId TEXT (FK to User),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP
);
```

### Goal Table
```sql
CREATE TABLE "Goal" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thrustArea TEXT NOT NULL,
  kpiType TEXT NOT NULL,
  target FLOAT NOT NULL,
  progress FLOAT DEFAULT 0,
  status ENUM (DRAFT, SUBMITTED, APPROVED, ...),
  approvalStatus ENUM (PENDING, APPROVED, REJECTED, ...),
  weightage FLOAT NOT NULL,
  deadline TIMESTAMP NOT NULL,
  locked BOOLEAN DEFAULT FALSE,
  employeeId TEXT NOT NULL (FK to User),
  sharedGoalId TEXT (FK to Goal),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP
);
```

### QuarterlyCheckin Table
```sql
CREATE TABLE "QuarterlyCheckin" (
  id TEXT PRIMARY KEY,
  goalId TEXT NOT NULL (FK to Goal),
  userId TEXT NOT NULL (FK to User),
  quarter TEXT (Q1, Q2, Q3, Q4),
  year INT,
  achievement TEXT NOT NULL,
  progress FLOAT,
  status ENUM (NOT_STARTED, ON_TRACK, COMPLETED, ...),
  managerComment TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP
);
```

### Other Tables:
- `Notification` - Alerts for users
- `ActivityLog` - Audit trail
- `AIInsight` - AI analysis results
- `GoalComment` - Discussion threads
- `AuditLog` - System changes

---

## 🔧 Database Troubleshooting

### Cannot Connect to Database
```bash
# Check if PostgreSQL is running
# Windows: tasklist | findstr postgres
# macOS: brew services list
# Linux: systemctl status postgresql

# Verify connection string
echo $DATABASE_URL

# Test connection manually
psql -U postgres -d elevateai
```

### "Database does not exist"
```bash
# Create the database
createdb -U postgres elevateai

# Or using psql:
psql -U postgres
CREATE DATABASE elevateai;
```

### "Password authentication failed"
```bash
# Check your password in .env.local
# Update DATABASE_URL with correct password:
DATABASE_URL="postgresql://postgres:CORRECT_PASSWORD@localhost:5432/elevateai"

# Restart dev server after updating
```

### "Port 5432 already in use"
```bash
# Find what's using port 5432
lsof -i :5432  # macOS/Linux
netstat -ano | findstr :5432  # Windows

# PostgreSQL might be running on different port
# Update DATABASE_URL accordingly:
DATABASE_URL="postgresql://postgres:password@localhost:5433/elevateai"
```

### Prisma Migration Errors
```bash
# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Or reset migrations
rm -rf prisma/migrations
npx prisma migrate dev --name init

# Regenerate Prisma client
npx prisma generate
```

---

## 🔄 Database Backup & Restore

### Backup Database

**Using pg_dump:**
```bash
# Create backup file
pg_dump -U postgres elevateai > elevateai_backup.sql

# Backup with custom format (smaller file)
pg_dump -U postgres -Fc elevateai > elevateai_backup.dump
```

### Restore from Backup

```bash
# Restore from SQL file
psql -U postgres -d elevateai < elevateai_backup.sql

# Restore from custom format
pg_restore -U postgres -d elevateai elevateai_backup.dump
```

---

## 📊 Database Maintenance

### View Database Size
```bash
psql -U postgres

# Inside psql:
SELECT
  datname,
  pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database
WHERE datname = 'elevateai';
```

### Optimize Database
```bash
# Vacuum to reclaim space
VACUUM ANALYZE "Goal";
VACUUM ANALYZE "QuarterlyCheckin";
VACUUM ANALYZE "User";

# Build indexes
REINDEX DATABASE elevateai;
```

### View Connections
```bash
# See who's connected
SELECT datname, usename, application_name, state
FROM pg_stat_activity
WHERE datname = 'elevateai';

# Kill a connection if needed
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'elevateai' AND pid <> pg_backend_pid();
```

---

## 🔐 Production Database Setup

### For Production Deployment:

1. **Use managed database service:**
   - AWS RDS
   - Heroku PostgreSQL
   - Railway PostgreSQL
   - DigitalOcean Managed Databases
   - Azure Database for PostgreSQL

2. **Update environment variables:**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database"
   NODE_ENV="production"
   ```

3. **Enable SSL connections:**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   ```

4. **Backup strategy:**
   - Daily automated backups
   - Point-in-time recovery enabled
   - Test restore procedures

---

## 🎯 Quick Start Script

All at once (macOS/Linux):

```bash
#!/bin/bash

# Create database
createdb -U postgres elevateai

# Navigate to project
cd ElevateAI

# Update .env.local with your password
echo "DATABASE_URL=\"postgresql://postgres:YOUR_PASSWORD@localhost:5432/elevateai\"" >> .env.local

# Install dependencies
npm install

# Push schema
npx prisma db push

# Seed data
npm run db:seed

# Start dev server
npm run dev

echo "✅ Database setup complete!"
echo "🚀 App running at http://localhost:3000"
```

---

## 📚 Useful psql Commands

```bash
# Connect to database
psql -U postgres -d elevateai

# Inside psql:
\l              # List all databases
\dt             # List all tables
\d table_name   # Describe table
\du             # List users/roles

# Query examples:
SELECT * FROM "User" LIMIT 5;
SELECT COUNT(*) FROM "Goal";
SELECT * FROM "Goal" WHERE status = 'APPROVED';

# Dump table to CSV
\copy (SELECT * FROM "Goal") TO STDOUT WITH CSV HEADER;

# Exit
\q
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] PostgreSQL running
- [ ] Database `elevateai` created
- [ ] All tables exist
- [ ] Demo users created
- [ ] Sample goals seeded
- [ ] Can connect via Prisma
- [ ] `npm run dev` works
- [ ] Dashboard loads
- [ ] Can login with demo credentials

---

## 🆘 Getting Help

1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env.local
3. Check database credentials
4. Review error messages carefully
5. See GETTING_STARTED.md for more details
6. Check PostgreSQL logs for system errors

---

**Database setup complete! 🎉**

Next: Run `npm run dev` to start the development server.
