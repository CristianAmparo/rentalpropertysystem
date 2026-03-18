import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    // Fetch 3 most recent vacant properties as featured
    const properties = await prisma.property.findMany({
      where: {
        isArchived: false,
        isVacant: true
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    })
    
    return properties.map((p: any) => ({
      ...p,
      bedrooms: p.beds,
      bathrooms: p.baths,
      image: p.images && Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null
    }))
  } catch (error) {
    console.error('Error fetching featured properties:', error)
    return []
  }
})
