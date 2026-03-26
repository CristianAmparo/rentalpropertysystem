import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { propertyId, action } = body

  if (!propertyId || !['save', 'unsave'].includes(action)) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid parameters' })
  }

  try {
    if (action === 'save') {
       // Using upsert or ignore constraint would be cleaner, but create works with the unique constraint block below
       const existing = await prisma.savedProperty.findFirst({
         where: { userId: user.id, propertyId }
       })
       if (!existing) {
         await prisma.savedProperty.create({
           data: { userId: user.id, propertyId }
         })
       }
    } else if (action === 'unsave') {
       await prisma.savedProperty.deleteMany({
         where: { userId: user.id, propertyId }
       })
    }
    return { success: true }
  } catch (error) {
    console.error('Error toggling saved property:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to update saved properties' })
  }
})
