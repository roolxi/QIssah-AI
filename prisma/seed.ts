import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // حساب أدمن
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: 'password123',
      role: 'ADMIN',
    },
  });

  // تصنيفات أساسية
  await prisma.category.createMany({
    data: [
      { name: 'Adventure' },
      { name: 'Role-play' },
      { name: 'Horror' },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
