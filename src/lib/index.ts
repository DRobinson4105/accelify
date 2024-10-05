const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  await prisma.user.create({
    data: {
      name: 'Rich',
      email: 'hello@prisma.com',
      password: '12345',
      
    },
  })
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })