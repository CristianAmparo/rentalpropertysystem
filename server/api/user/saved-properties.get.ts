import { defineEventHandler, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const saved = await prisma.savedProperty.findMany({
      where: { userId: user.id },
      select: { propertyId: true }
    })
    console.log(`[SSR DEBUG] Fetched ${saved.length} properties for user ${user.id}`)
    // Extract and return a clean string array of property UUIDs
    return saved.map((s: any) => s.propertyId)
  } catch (error) {
    console.error('Error fetching saved properties:', error)
    return []
  }
})
