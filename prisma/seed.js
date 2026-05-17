const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  // Delete old data (keep order to avoid FK constraint issues)
  await prisma.notification.deleteMany();
  await prisma.goalComment.deleteMany();
  await prisma.quarterlyCheckin.deleteMany();
  await prisma.aIInsight.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const hashedPassword = await hashPassword('password123');

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@elevateai.com',
      password: hashedPassword,
      role: 'ADMIN',
      department: 'Leadership',
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@elevateai.com',
      password: hashedPassword,
      role: 'MANAGER',
      department: 'Engineering',
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: 'Employee User',
      email: 'employee@elevateai.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
      managerId: manager.id,
      department: 'Engineering',
    },
  });

  // Create another employee
  const employee2 = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah@elevateai.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
      managerId: manager.id,
      department: 'Engineering',
    },
  });

  // Create goals with all required fields
  const deadline1 = new Date();
  deadline1.setMonth(deadline1.getMonth() + 3);

  const deadline2 = new Date();
  deadline2.setMonth(deadline2.getMonth() + 3);

  const deadline3 = new Date();
  deadline3.setMonth(deadline3.getMonth() + 3);

  await prisma.goal.createMany({
    data: [
      {
        title: 'Improve Customer Satisfaction',
        description: 'Increase customer satisfaction score to 90% by implementing better support systems',
        thrustArea: 'Customer Experience',
        kpiType: 'Percentage',
        target: 90,
        progress: 65,
        status: 'IN_PROGRESS',
        approvalStatus: 'APPROVED',
        weightage: 40,
        deadline: deadline1,
        locked: true,
        employeeId: employee.id,
      },
      {
        title: 'Reduce Bug Resolution Time',
        description: 'Reduce average bug fix time by 30% through process optimization',
        thrustArea: 'Engineering Efficiency',
        kpiType: 'Percentage',
        target: 30,
        progress: 15,
        status: 'IN_PROGRESS',
        approvalStatus: 'APPROVED',
        weightage: 30,
        deadline: deadline2,
        locked: true,
        employeeId: employee.id,
      },
      {
        title: 'Launch New Feature Module',
        description: 'Complete and launch the new analytics dashboard module with all planned features',
        thrustArea: 'Product Development',
        kpiType: 'Count',
        target: 5,
        progress: 20,
        status: 'IN_PROGRESS',
        approvalStatus: 'APPROVED',
        weightage: 30,
        deadline: deadline3,
        locked: true,
        employeeId: employee.id,
      },
      {
        title: 'Lead Q2 Planning Initiative',
        description: 'Lead department Q2 strategic planning and team alignment',
        thrustArea: 'Leadership',
        kpiType: 'Percentage',
        target: 100,
        progress: 0,
        status: 'DRAFT',
        approvalStatus: 'PENDING',
        weightage: 25,
        deadline: deadline1,
        locked: false,
        employeeId: employee2.id,
      },
    ],
  });

  // Create some check-ins
  const goal1 = await prisma.goal.findFirst({
    where: { title: 'Improve Customer Satisfaction' },
  });

  if (goal1) {
    await prisma.quarterlyCheckin.create({
      data: {
        goalId: goal1.id,
        userId: employee.id,
        quarter: 'Q2',
        year: 2026,
        achievement: 'Implemented new customer feedback system and trained team',
        progress: 65,
        status: 'ON_TRACK',
      },
    });
  }

  console.log('✅ Seed successful!');
  console.log('\n📝 Demo Accounts:');
  console.log('Admin: admin@elevateai.com / password123');
  console.log('Manager: manager@elevateai.com / password123');
  console.log('Employee: employee@elevateai.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });