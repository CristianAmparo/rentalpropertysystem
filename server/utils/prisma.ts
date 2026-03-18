
import pkg from '@prisma/client'
const { PrismaClient } = pkg
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

let prisma: any

if (process.env.NODE_ENV === 'production') {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
  prisma = new PrismaClient({ adapter });
} else {
  if (!(global as any).__prisma) {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
    (global as any).__prisma = new PrismaClient({ adapter });
  }
  prisma = (global as any).__prisma;
}

export { prisma }
