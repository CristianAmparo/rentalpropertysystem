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
    // Soft delete by updating isArchived
    const property = await prisma.property.update({
      where: { id },
      data: { isArchived: true }
    })
    
    return { success: true, message: 'Property archived successfully' }
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: 'Property not found' })
    }
    console.error('Delete property error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete property' })
  }
})
