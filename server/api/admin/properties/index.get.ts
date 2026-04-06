import { defineEventHandler, createError, getQuery } from 'h3'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const query = getQuery(event)
  const search = query.search as string
  const isArchived = query.isArchived === 'true'

  try {
    const properties = await prisma.property.findMany({
      where: {
        isArchived,
        ...(search ? { title: { contains: search } } : {})
      },
      orderBy: { createdAt: 'desc' }
    })
    return properties
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch properties' })
  }
})
