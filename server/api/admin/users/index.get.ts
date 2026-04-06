import { defineEventHandler, createError, getQuery } from 'h3'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const adminUser = event.context.user
  if (!adminUser || adminUser.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const query = getQuery(event)
  const search = query.search as string

  try {
    const users = await prisma.user.findMany({
      where: search ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } }
        ]
      } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        banned: true,
        createdAt: true,
        _count: {
          select: { applications: true, savedProps: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return users
  } catch (error) {
    console.error('Fetch users error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch users' })
  }
})
