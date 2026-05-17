// prisma/seed.ts
import { PrismaClient, Role, GoalStatus, ApprovalStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clear existing data
  await prisma.goal.deleteMany()
  await prisma.user.deleteMany()

  // Create demo users
  const hashedPassword = await bcrypt.hash("password123", 10)

  const admin = await prisma.user.create({
    data: {
      email: "admin@elevateai.com",
      name: "Admin User",
      password: hashedPassword,
      role: Role.ADMIN,
      department: "Leadership",
    },
  })

  const manager = await prisma.user.create({
    data: {
      email: "manager@elevateai.com",
      name: "Sarah Manager",
      password: hashedPassword,
      role: Role.MANAGER,
      department: "Product",
    },
  })

  const employee1 = await prisma.user.create({
    data: {
      email: "employee@elevateai.com",
      name: "Alex Employee",
      password: hashedPassword,
      role: Role.EMPLOYEE,
      department: "Product",
      managerId: manager.id,
    },
  })

  const employee2 = await prisma.user.create({
    data: {
      email: "john@elevateai.com",
      name: "John Developer",
      password: hashedPassword,
      role: Role.EMPLOYEE,
      department: "Engineering",
      managerId: manager.id,
    },
  })

  const employee3 = await prisma.user.create({
    data: {
      email: "jane@elevateai.com",
      name: "Jane Designer",
      password: hashedPassword,
      role: Role.EMPLOYEE,
      department: "Design",
      managerId: manager.id,
    },
  })

  // Create demo goals for employee 1
  const today = new Date()
  const q3End = new Date(today.getFullYear(), today.getMonth() + 3, 0)

  const goal1 = await prisma.goal.create({
    data: {
      title: "Increase Customer Satisfaction Score",
      description: "Improve your customer satisfaction score from 82% to 92% through better support and feedback analysis",
      thrustArea: "Customer Success",
      kpiType: "Customer Satisfaction",
      target: 92,
      progress: 87,
      status: GoalStatus.IN_PROGRESS,
      approvalStatus: ApprovalStatus.APPROVED,
      weightage: 30,
      deadline: q3End,
      locked: true,
      employeeId: employee1.id,
    },
  })

  const goal2 = await prisma.goal.create({
    data: {
      title: "Launch New Feature Module",
      description: "Successfully launch the new analytics module with all planned features and documentation",
      thrustArea: "Product Development",
      kpiType: "Project Completion",
      target: 100,
      progress: 65,
      status: GoalStatus.IN_PROGRESS,
      approvalStatus: ApprovalStatus.APPROVED,
      weightage: 40,
      deadline: q3End,
      locked: true,
      employeeId: employee1.id,
    },
  })

  const goal3 = await prisma.goal.create({
    data: {
      title: "Mentor Junior Team Members",
      description: "Provide guidance and mentorship to 2 junior team members on software development best practices",
      thrustArea: "Team Development",
      kpiType: "Mentorship Hours",
      target: 40,
      progress: 32,
      status: GoalStatus.IN_PROGRESS,
      approvalStatus: ApprovalStatus.APPROVED,
      weightage: 30,
      deadline: q3End,
      locked: true,
      employeeId: employee1.id,
    },
  })

  // Create goals for employee 2
  const goal4 = await prisma.goal.create({
    data: {
      title: "Reduce API Response Time",
      description: "Optimize database queries to reduce average API response time from 500ms to 200ms",
      thrustArea: "Performance",
      kpiType: "Response Time (ms)",
      target: 200,
      progress: 350,
      status: GoalStatus.IN_PROGRESS,
      approvalStatus: ApprovalStatus.APPROVED,
      weightage: 35,
      deadline: q3End,
      locked: true,
      employeeId: employee2.id,
    },
  })

  const goal5 = await prisma.goal.create({
    data: {
      title: "Complete Kubernetes Certification",
      description: "Get certified in Kubernetes to enhance cloud infrastructure skills",
      thrustArea: "Learning & Development",
      kpiType: "Certification",
      target: 100,
      progress: 75,
      status: GoalStatus.IN_PROGRESS,
      approvalStatus: ApprovalStatus.APPROVED,
      weightage: 30,
      deadline: q3End,
      locked: true,
      employeeId: employee2.id,
    },
  })

  const goal6 = await prisma.goal.create({
    data: {
      title: "Implement Automated Testing Suite",
      description: "Build comprehensive automated tests covering 80% of critical code paths",
      thrustArea: "Quality Assurance",
      kpiType: "Test Coverage %",
      target: 80,
      progress: 55,
      status: GoalStatus.IN_PROGRESS,
      approvalStatus: ApprovalStatus.APPROVED,
      weightage: 35,
      deadline: q3End,
      locked: true,
      employeeId: employee2.id,
    },
  })

  // Create goals for employee 3
  const goal7 = await prisma.goal.create({
    data: {
      title: "Redesign Dashboard UI",
      description: "Create a modern, user-friendly redesign of the analytics dashboard",
      thrustArea: "User Experience",
      kpiType: "Design Quality Score",
      target: 9,
      progress: 7.5,
      status: GoalStatus.IN_PROGRESS,
      approvalStatus: ApprovalStatus.APPROVED,
      weightage: 40,
      deadline: q3End,
      locked: true,
      employeeId: employee3.id,
    },
  })

  const goal8 = await prisma.goal.create({
    data: {
      title: "Conduct User Research",
      description: "Interview 15+ users to understand pain points in current product",
      thrustArea: "User Research",
      kpiType: "Users Interviewed",
      target: 15,
      progress: 8,
      status: GoalStatus.IN_PROGRESS,
      approvalStatus: ApprovalStatus.APPROVED,
      weightage: 30,
      deadline: q3End,
      locked: true,
      employeeId: employee3.id,
    },
  })

  const goal9 = await prisma.goal.create({
    data: {
      title: "Build Design System Components",
      description: "Create 20+ reusable design components for consistent UI",
      thrustArea: "Product Development",
      kpiType: "Components Created",
      target: 20,
      progress: 12,
      status: GoalStatus.IN_PROGRESS,
      approvalStatus: ApprovalStatus.APPROVED,
      weightage: 30,
      deadline: q3End,
      locked: true,
      employeeId: employee3.id,
    },
  })

  console.log("✅ Database seeded successfully!")
  console.log("\n📋 Demo Accounts:")
  console.log(`   Admin: admin@elevateai.com`)
  console.log(`   Manager: manager@elevateai.com`)
  console.log(`   Employee: employee@elevateai.com`)
  console.log(`\n🔐 Password for all accounts: password123`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
