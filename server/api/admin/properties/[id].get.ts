import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing ID' })

  try {
    const property = await prisma.property.findUnique({
      where: { id }
    })
    
    if (!property) {
      throw createError({ statusCode: 404, statusMessage: 'Property not found' })
    }

    return property
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch property' })
  }
})
