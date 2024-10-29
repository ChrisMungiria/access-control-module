// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Define the roles you want to create
  const roleNames = ['Admin', 'Engineer', 'Project Manager'];

  // Create roles if they don't exist
  for (const roleName of roleNames) {
    const roleExists = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!roleExists) {
      await prisma.role.create({
        data: { name: roleName },
      });
      console.log(`Role '${roleName}' created.`);
    } else {
      console.log(`Role '${roleName}' already exists.`);
    }
  }

  // Fetch all roles after creation
  const roles = await prisma.role.findMany();

  const users = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const randomRoleId = faker.number.int({ min: 1, max: roles.length });
      const password = faker.internet.password();
      const hashedPassword = await bcrypt.hash('password', 10);

      return await prisma.user.create({
        data: {
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          email: faker.internet.email(),
          password: hashedPassword,
          roleId: randomRoleId,
        },
      });
    }),
  );

  console.log('10 users created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
