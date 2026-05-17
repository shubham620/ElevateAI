const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Delete old data
  await prisma.goal.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@elevateai.com',
      password: 'password123',
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@elevateai.com',
      password: 'password123',
      role: 'MANAGER',
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: 'Employee User',
      email: 'employee@elevateai.com',
      password: 'password123',
      role: 'EMPLOYEE',
      managerId: manager.id,
    },
  });

  // Create goals
  await prisma.goal.createMany({
    data: [
      {
        title: 'Improve Customer Satisfaction',
        description: 'Increase customer satisfaction score to 90%',
        thrustArea: 'Customer Experience',
        target: 90,
        progress: 65,
        status: 'ON_TRACK',
        weightage: 40,
        employeeId: employee.id,
      },
      {
        title: 'Reduce Bug Resolution Time',
        description: 'Reduce average bug fix time by 30%',
        thrustArea: 'Engineering Efficiency',
        target: 30,
        progress: 15,
        status: 'IN_PROGRESS',
        weightage: 30,
        employeeId: employee.id,
      },
    ],
  });

  console.log('✅ Seed successful!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });