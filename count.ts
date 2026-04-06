import { prisma } from './server/utils/prisma';

async function main() {
  console.log('Users:', await prisma.user.count());
  console.log('Properties:', await prisma.property.count());
  console.log('Applications:', await prisma.application.count());
}

main().catch(console.error).finally(() => prisma.$disconnect());
